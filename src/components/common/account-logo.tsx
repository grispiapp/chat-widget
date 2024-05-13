import { useChatBox } from "@context/chat-box-context";
import { cn } from "@lib/utils";
import { type FC, type JSX } from "preact/compat";

interface AccountLogoProps extends JSX.HTMLAttributes<HTMLImageElement> {}

export const AccountLogo: FC<AccountLogoProps> = ({ className, ...props }) => {
    const { options } = useChatBox();

    return (
        <img
            {...props}
            className={cn("cb-h-8 cb-w-8 cb-rounded-full cb-object-cover", className)}
            src={options.account.logo}
            alt={options.account.title}
        />
    );
};
