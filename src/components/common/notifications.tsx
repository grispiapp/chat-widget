import { useNotification } from "@context/notification-context";
import { cn } from "@lib/utils";

export const Notifications = () => {
    const { notifications } = useNotification();

    return (
        <div className="cb-absolute cb-inset-x-0 cb-top-0 cb-z-50 cb-space-y-2 cb-p-3 md:-cb-top-3 md:-cb-translate-y-full md:cb-p-0">
            {notifications.map(({ id, type, state, title, text }) => (
                <div
                    key={id}
                    className={cn(
                        "cb-space-y-1 cb-rounded-lg cb-p-3 cb-text-sm cb-transition-all",
                        {
                            "cb-bg-danger/90 cb-text-muted-background": type === "error",
                            "cb-bg-success/90 cb-text-muted-background": type === "success",

                            "-cb-translate-y-12 cb-opacity-0 md:cb-translate-y-12":
                                state === "opening" || "closing",
                            "cb-opacity-1 cb-translate-y-0 md:cb-translate-y-0": state === "open",
                        }
                    )}
                >
                    {title && <h4 className="cb-font-medium">{title}</h4>}
                    <span>{text}</span>
                </div>
            ))}
        </div>
    );
};
