import { Typing } from "@components/common/typing";
import { SendIcon } from "@components/icons";
import ChatBoxContext from "@context/chat-box-context";
import ConversationContext from "@context/conversation-context";
import { cn } from "@lib/utils";
import { Button } from "@ui/button";
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "preact/hooks";
import { type JSX } from "preact/jsx-runtime";

export const ChatBoxFooter = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState<string>("");

  const { state: boxState } = useContext(ChatBoxContext);
  const {
    state: conversationState,
    addMessage,
    replies,
    selectReply,
  } = useContext(ConversationContext);

  useEffect(() => {
    if (boxState === "open" && conversationState === "idle") {
      inputRef.current?.focus();
    }
  }, [boxState, conversationState]);

  useEffect(() => {
    inputRef.current?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();

        handleSubmit(e, inputRef.current?.value);
      }
    });
  }, []);

  const handleSubmit = useCallback(
    async (
      e: JSX.TargetedSubmitEvent<HTMLFormElement> | KeyboardEvent,
      value: string
    ) => {
      e.preventDefault();

      if (conversationState === "typing" || !value?.trim()) {
        inputRef.current?.focus();
        return;
      }

      setValue("");

      try {
        await addMessage({
          text: value,
          sender: "user",
        });

        inputRef.current?.focus();
      } catch (err) {
        setValue(value);
      }
    },
    [conversationState]
  );

  const rows = value.split("\n").length;

  return (
    <div className="cb-relative">
      <div className="cb-absolute cb-left-0 cb-right-0 cb-bottom-0 cb-z-50">
        {(conversationState === "typing" || replies.length > 0) &&
          (conversationState === "typing" ? (
            <div className="cb-px-3">
              <Typing />
            </div>
          ) : (
            <div className="cb-flex cb-relative">
              {/* <div className="cb-absolute cb-left-0 cb-top-0 cb-bottom-0 cb-w-12 cb-bg-gradient-to-r cb-from-gray-200/90 cb-to-transparent cb-pointer-events-none cb-select-none"></div> */}
              <div className="cb-flex cb-flex-wrap cb-items-center cb-gap-2 cb-px-3">
                {replies.map((reply) => (
                  <Button
                    onClick={() => selectReply(reply)}
                    variant="suggest"
                    size="sm"
                    rounded="full"
                    key={reply.label}
                  >
                    {reply.label}
                  </Button>
                ))}
              </div>
              {/* <div className="cb-absolute cb-right-0 cb-top-0 cb-bottom-0 cb-w-12 cb-bg-gradient-to-l cb-from-gray-200/90 cb-to-transparent cb-pointer-events-none cb-select-none"></div> */}
            </div>
          ))}
        <div className="cb-p-3">
          <form
            onSubmit={(e) => handleSubmit(e, value)}
            className={cn("cb-flex cb-gap-3", {
              "cb-items-end": rows > 1,
              "cb-items-center": rows === 1,
            })}
          >
            <textarea
              ref={inputRef}
              type="text"
              placeholder="Mesajınızı buraya yazın..."
              className="cb-w-full cb-max-h-32 cb-p-3 cb-border cb-rounded-2xl focus:cb-outline-none cb-text-sm cb-bg-white cb-resize-none disabled:cb-opacity-75"
              rows={rows}
              disabled={conversationState === "typing"}
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
            />
            <div className="cb-flex cb-items-center cb-justify-center">
              <Button
                size="sm"
                icon={SendIcon}
                disabled={conversationState === "typing"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
