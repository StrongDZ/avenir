import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", className = "", ...props }) => {
    const base =
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40";
    const styles = {
        primary: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:scale-[1.02] focus-visible:outline-blue-400",
        secondary: "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-blue-300",
        danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-400",
        ghost: "bg-transparent text-white hover:bg-white/10 focus-visible:outline-white/40",
    }[variant];
    return <button className={[base, styles, className].join(" ")} {...props} />;
};
