import { cn } from "@lib/utils";
import type { FC } from "preact/compat";
import type { JSX } from "preact/jsx-runtime";

interface LabelProps extends JSX.HTMLAttributes<HTMLLabelElement> {}

export const Label: FC<LabelProps> = ({ className, children, ...props }) => {
  return (
    <label {...props} className={cn(className, "cb-font-medium")}>
      {children}
    </label>
  );
};
