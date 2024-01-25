import ChatBoxContext, { ChatBoxContextType } from "@context/chat-box-context";
import { useErrors } from "@hooks/useErrors";
import { InternalEventTypeMap } from "@lib/config";
import { blank } from "@lib/utils";
import { subscribeChat } from "@lib/websocket";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { useCallback, useContext } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { createChat } from "../api/chat";
import { UserInput } from "../types/user";

export const UserForm = () => {
  const { chat, user, setUser, setChat } = useContext(ChatBoxContext);
  const { errors, setError } = useErrors<UserInput>();

  const handleInputChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = useCallback(
    (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      let hasError = false;

      if (blank(user.fullName)) {
        setError("fullName", "Please enter your name.");
        hasError = true;
      }

      if (blank(user.email)) {
        setError("email", "Please enter your email.");
        hasError = true;
      }

      if (hasError) return;

      alert("hop");
    },
    [user],
  );

  const handleSubscribeChat = useCallback(async () => {
    if (chat?.subscribed) return;
    if (blank(user?.fullName) || blank(user?.email)) return;

    const chatResponse = await createChat(user);

    window.dispatchEvent(
      new CustomEvent(InternalEventTypeMap.NEW_CHAT_CREATED, {
        detail: chatResponse,
      }),
    );

    await subscribeChat(chatResponse);

    const newChatState: ChatBoxContextType["chat"] = {
      ...chatResponse,
      subscribed: true,
    };

    setChat(newChatState);
  }, [user, chat]);

  return (
    <div className="cb-space-y-3 cb-rounded-lg cb-border-2 cb-border-primary cb-bg-background/50 cb-p-3 cb-text-sm cb-text-foreground cb-backdrop-blur-lg">
      <div>
        <h3 className="cb-font-medium cb-text-primary">Contact Informations</h3>
        <p className="cb-text-muted-foreground cb-text-xs">
          Please provide your contact information below to establish a
          connection with an agent.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="cb-space-y-3">
        <Input
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
    </div>
  );
};
