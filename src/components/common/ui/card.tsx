import { cn, filled } from "@lib/utils";
import { type FC } from "preact/compat";
import { type JSX } from "preact/jsx-runtime";
import { LoadingSpinner } from "./loading-spinner";

interface CardProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "loading"> {
    title: string;
    description?: string;
    loading?: boolean;
}

export const Card: FC<CardProps> = ({
    title,
    description,
    loading = false,
    className,
    children,
}) => {
    return (
        <div
            className={cn(
                "cb-relative cb-space-y-3 cb-overflow-hidden cb-rounded-lg cb-border-2 cb-border-primary cb-bg-background cb-p-3 cb-text-sm cb-text-foreground cb-shadow-lg cb-shadow-primary/20 cb-backdrop-blur-lg",
                className
            )}
        >
            <div>
                <h3 className="cb-font-medium cb-text-primary">{title}</h3>
                {filled(description) && (
                    <p className="cb-text-xs cb-text-muted-foreground">{description}</p>
                )}
            </div>
            {children}
            {loading && <LoadingSpinner />}
        </div>
    );
};
