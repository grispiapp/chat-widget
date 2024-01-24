import { AgentAvatar } from "@components/common/agent-avatar";
import ChatBoxContext from "@context/chat-box-context";
import ConversationContext from "@context/conversation-context";
import { Button } from "@ui/button";
import { useContext } from "preact/hooks";
import { IoMdClose, IoMdRefresh } from "react-icons/io";

export const ChatBoxHeader = () => {
  const { toggleState, options } = useContext(ChatBoxContext);
  const { reset } = useContext(ConversationContext);

  const handleRefresh = () => {
    const confirm = window.confirm(
      "Konuşma yeniden başlatılacak ve geçmiş konuşmalar silecek. Onaylıyor musunuz?"
    );

    confirm && reset();
  };

  return (
    <div className="cb-flex cb-items-center cb-justify-between cb-py-2 cb-px-3 cb-border-b cb-border-opacity-25">
      <div className="cb-flex cb-items-center cb-gap-2">
        <AgentAvatar />
        <span className="cb-font-bold cb-text-sm">{options.agent.name}</span>
      </div>
      <div className="cb-flex cb-items-center cb-text-zinc-600">
        <Button onClick={handleRefresh} variant="link" icon={IoMdRefresh} />
        <Button onClick={toggleState} variant="link" icon={IoMdClose} />
      </div>
    </div>
  );
};
