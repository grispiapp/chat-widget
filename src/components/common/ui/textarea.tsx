import { cn, filled, getFirst, inputId } from "@lib/utils";
import { forwardRef, type JSX } from "preact/compat";
import { ErrorSpan } from "./error-span";
import { Label } from "./label";

interface TextAreaProps extends JSX.HTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, type, name, className, ...props }, ref) => {
        const id = inputId(name?.toString());

        return (
            <div className="cb-space-y-1">
                {label && <Label for={id}>{label}</Label>}
                <textarea
                    {...props}
                    ref={ref}
                    id={id}
                    type={getFirst(type, "text")}
                    name={name}
                    className={cn(
                        className,
                        "cb-block cb-w-full cb-rounded cb-border cb-p-2 focus:cb-outline-primary",
                        {
                            "cb-border-danger": filled(error),
                        }
                    )}
                />
                {filled(error) && <ErrorSpan>{error}</ErrorSpan>}
            </div>
        );
    }
);
