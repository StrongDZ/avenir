import React from "react";

export const Loader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-3 text-sm text-slate-200/80">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-blue-500/20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-200 border-t-transparent" />
        </div>
        <span>{text}</span>
    </div>
);
