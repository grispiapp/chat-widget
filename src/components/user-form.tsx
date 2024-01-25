import ChatBoxContext, { ChatBoxContextType } from "@context/chat-box-context";
import ConversationContext from "@context/conversation-context";
import { useErrors } from "@hooks/useErrors";
import { InternalEventTypeMap } from "@lib/config";
import { blank, isEmail } from "@lib/utils";
import { subscribeChat } from "@lib/websocket";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { LoadingSpinner } from "@ui/loading-spinner";
import { useCallback, useContext, useEffect, useRef, useState } from "preact/hooks";
import { type JSX } from "preact/jsx-runtime";
import { createChat } from "../api/chat";
import { type UserInput } from "../types/user";

export const UserForm = () => {
    const fullNameRef = useRef<HTMLInputElement>(null);
    const { chat, user, setUser, setChat, isUserFormVisible, setUserFormVisibility } =
        useContext(ChatBoxContext);
    const { messages } = useContext(ConversationContext);
    const { errors, setError, resetErrors } = useErrors<UserInput>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubscribeChat = useCallback(async () => {
        if (chat?.subscribed) return;
        if (blank(user?.fullName) || blank(user?.email)) return;

        setLoading(true);

        const firstEndUserMessage = messages.filter(
            (message) => message.sender === "user" && message.shouldSendToApi === true
        )?.[0];

        try {
            const chatResponse = await createChat(user);

            window.dispatchEvent(
                new CustomEvent(InternalEventTypeMap.NEW_CHAT_CREATED, {
                    detail: chatResponse,
                })
            );

            await subscribeChat(chatResponse);

            const newChatState: ChatBoxContextType["chat"] = {
                ...chatResponse,
                subscribed: true,
            };

            setChat(newChatState);
            setUserFormVisibility(false);

            // TODO: send first user message with firstEndUserMessage
        } catch (err) {
            console.error(`Failed when subscribing chat...`, err);
        } finally {
            setLoading(false);
        }
    }, [user, chat, messages, setChat, setUserFormVisibility]);

    const handleSubmit = useCallback(
        (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            let hasError = false;

            resetErrors();

            if (blank(user.fullName)) {
                setError("fullName", "Please enter your name.");
                hasError = true;
            }

            if (blank(user.email)) {
                setError("email", "Please enter your email.");
                hasError = true;
            } else if (!isEmail(user.email)) {
                setError("email", "Please enter a valid email.");
                hasError = true;
            }

            if (hasError) return;

            handleSubscribeChat();
        },
        [user, setError, handleSubscribeChat, resetErrors]
    );

    useEffect(() => {
        if (isUserFormVisible) {
            fullNameRef.current.focus();
        }
    }, [isUserFormVisible]);

    return (
        <div className="cb-relative cb-space-y-3 cb-overflow-hidden cb-rounded-lg cb-border-2 cb-border-primary cb-bg-background cb-p-3 cb-text-sm cb-text-foreground cb-shadow-lg cb-shadow-primary/20 cb-backdrop-blur-lg">
            <div>
                <h3 className="cb-font-medium cb-text-primary">Contact Informations</h3>
                <p className="cb-text-muted-foreground cb-text-xs">
                    Please provide your contact information below to establish a connection with an
                    agent.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="cb-space-y-3">
                <Input
                    ref={fullNameRef}
                    name="fullName"
                    onChange={handleInputChange}
                    value={user.fullName}
                    label="Fullname"
                    error={errors?.fullName}
                />
                <Input
                    name="email"
                    onChange={handleInputChange}
                    value={user.email}
                    label="Email"
                    error={errors?.email}
                />
                <Button size="sm">Connect</Button>
            </form>
            {loading && <LoadingSpinner />}
        </div>
    );
};
