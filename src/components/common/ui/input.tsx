import { cn, filled, getFirst, inputId } from "@lib/utils";
import type { FC, JSX } from "preact/compat";
import { Label } from "./label";

interface InputProps extends JSX.HTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: FC<InputProps> = ({
  label,
  error,
  type,
  name,
  className,
  ...props
}) => {
  const id = inputId(name?.toString());

  return (
    <div className="cb-space-y-1">
      {label && <Label for={id}>{label}</Label>}
      <input
        {...props}
        id={id}
        type={getFirst(type, "text")}
        name={name}
        className={cn(
          className,
          "cb-block cb-w-full cb-p-2 cb-rounded cb-border focus:cb-outline-primary",
          {
            "cb-border-red-500": filled(error),
          },
        )}
      />
      {filled(error) && <span className="cb-text-red-500">{error}</span>}
    </div>
  );
};
