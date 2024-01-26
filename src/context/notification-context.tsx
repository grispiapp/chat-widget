import { getFirst, uuidv4 } from "@lib/utils";
import { createContext } from "preact";
import { useCallback, useContext, useState } from "preact/hooks";

interface Notification {
    id: string;
    title?: string;
    text: string;
    type: "success" | "error";
    duration: number;
    state: "opening" | "open" | "closing";
}

interface AddNotification extends Omit<Notification, "id" | "duration" | "state"> {
    id?: Notification["id"];
    duration?: Notification["duration"];
}

interface UpdateNotification {
    id?: Notification["id"];
    text?: Notification["text"];
    state?: Notification["state"];
}

interface NotificationContextType {
    notifications: Notification[];
    notify: (notification: AddNotification) => void;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    notify: () => {},
});

export const NotificationContextProvider = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const update = useCallback(
        (notificationId: Notification["id"], newNotification: UpdateNotification) => {
            setNotifications((prev) =>
                prev.map((n) => {
                    if (n.id === notificationId) {
                        n = { ...n, ...newNotification };
                    }

                    return n;
                })
            );
        },
        []
    );

    const remove = useCallback((notificationId: Notification["id"]) => {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    }, []);

    const notify = useCallback(
        (notification: Notification) => {
            notification.id = getFirst(notification.id, uuidv4);
            notification.duration = getFirst(notification.duration, 3000);
            notification.state = "opening";

            // add notification to list
            setNotifications((prev) => [...prev, notification]);

            // set state to visible after 100ms
            setTimeout(() => {
                update(notification.id, {
                    state: "open",
                });
            }, 100);

            // set state to  after {duration} - 100
            setTimeout(() => {
                update(notification.id, {
                    state: "closing",
                });
            }, notification.duration - 100);

            // remove notification after {duration}
            setTimeout(() => {
                remove(notification.id);
            }, notification.duration);
        },
        [update, remove]
    );

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                notify,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};

export default NotificationContext;
