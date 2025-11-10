import React from "react";

export interface Notice {
    id: string;
    message: string;
    type?: "info" | "success" | "error";
}

export function useNotificationState() {
    const [notices, setNotices] = React.useState<Notice[]>([]);

    const notify = (message: string, type: Notice["type"] = "info") => {
        const id = Math.random().toString(36).slice(2);
        setNotices((n) => [...n, { id, message, type }]);
        setTimeout(() => dismiss(id), 2500);
    };

    const dismiss = (id: string) => setNotices((n) => n.filter((x) => x.id !== id));

    return { notices, notify, dismiss };
}
