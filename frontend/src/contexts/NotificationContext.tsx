import React from "react";
import { Notice, useNotificationState } from "../hooks/useNotification";

interface NotificationContextValue {
    notices: Notice[];
    notify: (msg: string, type?: Notice["type"]) => void;
    dismiss: (id: string) => void;
}

export const NotificationContext = React.createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const state = useNotificationState();
    return <NotificationContext.Provider value={state}>{children}</NotificationContext.Provider>;
};

export function useNotification() {
    const ctx = React.useContext(NotificationContext);
    if (!ctx) throw new Error("NotificationContext not available");
    return ctx;
}
