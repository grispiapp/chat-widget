import { type FC } from "preact/compat";
import { type JSX } from "preact/jsx-runtime";

interface ErrorSpanProps extends JSX.HTMLAttributes<HTMLSpanElement> {}

export const ErrorSpan: FC<ErrorSpanProps> = ({ children }) => {
    return <span className="cb-text-xs cb-text-danger">{children}</span>;
};
