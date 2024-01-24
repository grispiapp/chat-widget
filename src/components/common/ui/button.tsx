import { type IconType } from "@components/icons";
import { cn } from "@lib/utils";
import type { JSX, FC } from "preact/compat";

interface ButtonProps
  extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "icon" | "size"> {
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
        "cb-flex cb-items-center cb-justify-center cb-gap-2 cb-font-semibold cb-transition-colors cb-border cb-border-transparent",
        {
          "cb-rounded-none": rounded === "none",
          "cb-rounded-sm": rounded === "sm",
          "cb-rounded-md": rounded === "md",
          "cb-rounded-lg": rounded === "lg",
          "cb-rounded-full": rounded === "full",
        },
        {
          "cb-py-1 cb-px-2 cb-text-sm": size === "sm",
          "cb-py-2 cb-px-3 cb-text-base": size === "md",
          "cb-py-3 cb-px-4 cb-text-lg": size === "lg",
        },
        {
          "cb-bg-primary cb-text-white hover:cb-bg-primary/80":
            variant === "primary",
          "cb-bg-white cb-text-zinc-600 hover:cb-bg-zinc-100 hover:cb-text-zinc-600":
            variant === "secondary",
          "cb-text-zinc-600 hover:cb-text-zinc-800": variant === "link",
          "cb-bg-white/50 cb-backdrop-blur-lg cb-border-primary/60 cb-text-primary cb-px-3 cb-py-2 hover:cb-bg-primary hover:cb-text-white":
            variant === "suggest",
        },
        {
          "cb-w-8 cb-h-8 cb-rounded-full": !children && icon && size === "sm",
          "cb-w-10 cb-h-10 cb-rounded-full": !children && icon && size === "md",
          "cb-w-12 cb-h-12 cb-rounded-full": !children && icon && size === "lg",
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
