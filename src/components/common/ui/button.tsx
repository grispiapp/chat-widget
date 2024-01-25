import { type IconType } from "@components/icons";
import { cn } from "@lib/utils";
import type { FC, JSX } from "preact/compat";

interface ButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "icon" | "size"> {
    icon?: IconType;
    rounded?: "none" | "sm" | "md" | "lg" | "full";
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "link" | "suggest";
}

export const Button: FC<ButtonProps> = ({
    icon,
    rounded = "md",
    size = "md",
    variant = "primary",
    children,
    className,
    disabled = false,
    ...props
}) => {
    return (
        <button
            {...props}
            disabled={disabled}
            className={cn(
                "cb-flex cb-items-center cb-justify-center cb-gap-2 cb-border cb-border-transparent cb-font-semibold cb-transition-colors",
                {
                    "cb-rounded-none": rounded === "none",
                    "cb-rounded-sm": rounded === "sm",
                    "cb-rounded-md": rounded === "md",
                    "cb-rounded-lg": rounded === "lg",
                    "cb-rounded-full": rounded === "full",
                },
                {
                    "cb-px-2 cb-py-1 cb-text-sm": size === "sm",
                    "cb-px-3 cb-py-2 cb-text-base": size === "md",
                    "cb-px-4 cb-py-3 cb-text-lg": size === "lg",
                },
                {
                    "cb-bg-primary cb-text-background hover:cb-bg-primary/80": variant === "primary",
                    "cb-bg-white cb-text-zinc-600 hover:cb-bg-zinc-100 hover:cb-text-zinc-600": variant === "secondary",
                    "cb-text-muted-foreground hover:cb-text-foreground": variant === "link",
                    "cb-border-primary/60 cb-bg-background/50 cb-px-3 cb-py-2 cb-text-primary cb-backdrop-blur-lg hover:cb-bg-primary hover:cb-text-background":
                        variant === "suggest",
                },
                {
                    "cb-h-8 cb-w-8 cb-rounded-full": !children && icon && size === "sm",
                    "cb-h-10 cb-w-10 cb-rounded-full": !children && icon && size === "md",
                    "cb-h-12 cb-w-12 cb-rounded-full": !children && icon && size === "lg",
                },
                {
                    "cb-pointer-events-none cb-select-none cb-opacity-75": disabled,
                },
                className
            )}
        >
            {icon && (
                <div className="shrink-0">
                    {icon({
                        className: cn({
                            "cb-w-5 cb-h-5": size === "sm",
                            "cb-w-6 cb-h-6": size === "md",
                            "cb-w-7 cb-h-7": size === "lg",
                        }),
                    })}
                </div>
            )}
            {children}
        </button>
    );
};
