import { useTranslation } from "@hooks/useTranslation";
import { cn } from "@lib/utils";
import { type FC, type JSX } from "preact/compat";

interface AgentAvatarProps extends JSX.HTMLAttributes<HTMLImageElement> {}

export const AgentAvatar: FC<AgentAvatarProps> = ({ className, ...props }) => {
    const { t } = useTranslation();

    return (
        <img
            {...props}
            className={cn("cb-h-8 cb-w-8 cb-rounded-full cb-object-cover", className)}
            src={t("agent.avatar")}
            alt={t("agent.name")}
        />
    );
};
