import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { useChat } from "@hooks/useChat";
import { useErrors } from "@hooks/useErrors";
import { useTranslation } from "@hooks/useTranslation";
import { blank, debug, isEmail } from "@lib/utils";
import { sendMessage } from "@lib/websocket";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Input } from "@ui/input";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { type JSX } from "preact/jsx-runtime";
import { type WsMessage } from "../types/backend";
import { type UserInput } from "../types/user";

export const UserForm = () => {
    const fullNameRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const { notify } = useNotification();
    const { subscribeToNewChat } = useChat();
    const { chat, user, setUser } = useChatBox();
    const {
        messages,
        state: conversationState,
        setState: setConversationState,
    } = useConversation();
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
            setConversationState("idle");

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
    }, [user, chat, messages, setConversationState, subscribeToNewChat, notify]);

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
                setError("email", t("userForm.email.invalid"));
                hasError = true;
            }

            if (hasError) return;

            handleSubscribeChat();
        },
        [user, setError, handleSubscribeChat, resetErrors]
    );

    useEffect(() => {
        if (conversationState === "user-form") {
            fullNameRef.current.focus();
        }
    }, [conversationState]);

    return (
        <Card title={t("userForm.title")} description={t("userForm.text")} loading={loading}>
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
        </Card>
    );
};
