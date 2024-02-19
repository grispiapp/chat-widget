import { useChatBox } from "@context/chat-box-context";
import { useConversation } from "@context/conversation-context";
import { useNotification } from "@context/notification-context";
import { useChat } from "@hooks/useChat";
import { useErrors } from "@hooks/useErrors";
import { useTranslation } from "@hooks/useTranslation";
import { blank, isEmail } from "@lib/utils";
import { Button } from "@ui/button";
import { Card } from "@ui/card";
import { Input } from "@ui/input";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { type JSX } from "preact/jsx-runtime";
import type { UserInput } from "../types/user";

export const UserForm = () => {
    const inputRefs = useRef<HTMLInputElement[]>([]);
    const { t } = useTranslation();
    const { notify } = useNotification();
    const { subscribeToNewChat } = useChat();
    const { options, chat, user, setUser } = useChatBox();
    const { state: conversationState } = useConversation();
    const { errors, setError, resetErrors } = useErrors<UserInput>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubscribeChat = useCallback(async () => {
        if (chat?.subscribed) return;
        if (blank(user?.fullName) || blank(user?.email)) return;

        setLoading(true);

        try {
            await subscribeToNewChat();
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
    }, [user, chat, t, subscribeToNewChat, notify]);

    const handleSubmit = useCallback(
        (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            let hasError = false;

            resetErrors();

            options.forms.userForm.fields.forEach((field) => {
                if (blank(field.rules)) return;

                if (field.rules.includes("required") && blank(user[field.name])) {
                    setError(field.name, t(`userForm.${field.name}.required`));
                    hasError = true;
                }

                if (field.rules.includes("email") && !isEmail(user[field.name].toString())) {
                    setError(field.name, t(`userForm.${field.name}.invalid`));
                    hasError = true;
                }
            });

            if (hasError) return;

            handleSubscribeChat();
        },
        [options, user, t, setError, handleSubscribeChat, resetErrors]
    );

    useEffect(() => {
        if (conversationState === "user-form") {
            inputRefs.current?.[0]?.focus();
        }
    }, [conversationState]);

    return (
        <Card title={t("userForm.title")} description={t("userForm.text")} loading={loading}>
            <form onSubmit={handleSubmit} className="cb-space-y-3">
                {options.forms.userForm.fields.map((field, i) => (
                    <Input
                        ref={(el) => (inputRefs.current[i] = el)}
                        key={field.name}
                        name={field.name}
                        onChange={handleInputChange}
                        value={user[field.name]}
                        label={t(field.label)}
                        error={errors?.[field.name]}
                    />
                ))}
                <Button size="sm">{t("userForm.submit")}</Button>
            </form>
        </Card>
    );
};
