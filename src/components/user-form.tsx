import { useChatBox } from "@context/chat-box-context";
import ConversationContext from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { useChat } from "@hooks/useChat";
import { useErrors } from "@hooks/useErrors";
import { blank, debug, isEmail } from "@lib/utils";
import { sendMessage } from "@lib/websocket";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { LoadingSpinner } from "@ui/loading-spinner";
import { useCallback, useContext, useEffect, useRef, useState } from "preact/hooks";
import { type JSX } from "preact/jsx-runtime";
import { t } from "../lang";
import { WsMessage } from "../types/backend";
import { type UserInput } from "../types/user";

export const UserForm = () => {
    const fullNameRef = useRef<HTMLInputElement>(null);
    const { notify } = useNotification();
    const { subscribeToNewChat } = useChat();
    const { chat, user, setUser, setChat, isUserFormVisible, setUserFormVisibility } = useChatBox();
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
            const { chat } = await subscribeToNewChat();
            setUserFormVisibility(false);

            if (!firstEndUserMessage) return;

            const wsMessage = {
                id: firstEndUserMessage.id,
                sender: user.fullName,
                sentAt: Date.now(),
                text: firstEndUserMessage.text,
            } as WsMessage;

            debug("Sending first message...", { wsMessage });
            sendMessage(wsMessage, chat);
        } catch (err) {
            notify({
                title: t("errors.common.title"),
                text: t("errors.common.text"),
                type: "error",
            });

            console.error(`Failed when subscribing chat...`, err);
        } finally {
            setLoading(false);
        }
    }, [user, chat, messages, setUserFormVisibility, subscribeToNewChat, notify]);

    const handleSubmit = useCallback(
        (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            let hasError = false;

            resetErrors();

            if (blank(user.fullName)) {
                setError("fullName", t("userForm.fullName.required"));
                hasError = true;
            }

            if (blank(user.email)) {
                setError("email", t("userForm.email.required"));
                hasError = true;
            } else if (!isEmail(user.email)) {
                setError("email", t("userForm.email.notValid"));
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
                <h3 className="cb-font-medium cb-text-primary">{t("userForm.title")}</h3>
                <p className="cb-text-xs cb-text-muted-foreground">{t("userForm.text")}</p>
            </div>
            <form onSubmit={handleSubmit} className="cb-space-y-3">
                <Input
                    ref={fullNameRef}
                    name="fullName"
                    onChange={handleInputChange}
                    value={user.fullName}
                    label={t("userForm.fullName.label")}
                    error={errors?.fullName}
                />
                <Input
                    name="email"
                    onChange={handleInputChange}
                    value={user.email}
                    label={t("userForm.email.label")}
                    error={errors?.email}
                />
                <Button size="sm">{t("userForm.submit")}</Button>
            </form>
            {loading && <LoadingSpinner />}
        </div>
    );
};
