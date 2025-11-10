import React from "react";
import { useNotification } from "../../contexts/NotificationContext";

export const NotificationStack: React.FC = () => {
    const { notices, dismiss } = useNotification();
    return (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {notices.map((n) => {
                const bgColor = {
                    success: "bg-green-50 border-green-200 text-green-800",
                    error: "bg-red-50 border-red-200 text-red-800",
                    info: "bg-blue-50 border-blue-200 text-blue-800",
                }[n.type || "info"];
                return (
                    <div
                        key={n.id}
                        className={`${bgColor} shadow-lg border rounded-lg px-4 py-3 text-sm min-w-[250px] animate-in slide-in-from-right`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">{n.message}</div>
                            <button className="text-xs opacity-70 hover:opacity-100 shrink-0" onClick={() => dismiss(n.id)}>
                                ✕
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
