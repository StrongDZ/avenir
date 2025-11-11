import React from "react";

export const Loader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-3 text-sm text-gray-600">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-200 bg-teal-50">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-300 border-t-transparent" />
        </div>
        <span>{text}</span>
    </div>
);
