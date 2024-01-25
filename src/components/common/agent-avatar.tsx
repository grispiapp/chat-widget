import ChatBoxContext from "@context/chat-box-context";
import { cn } from "@lib/utils";
import { useContext, type FC, type JSX } from "preact/compat";

interface AgentAvatarProps extends JSX.HTMLAttributes<HTMLImageElement> {}

export const AgentAvatar: FC<AgentAvatarProps> = ({ className, ...props }) => {
    const { options } = useContext(ChatBoxContext);

    return (
        <img
            {...props}
            className={cn("cb-h-8 cb-w-8 cb-rounded-full", className)}
            src={options.agent.avatar}
            alt={options.agent.name}
        />
    );
};
