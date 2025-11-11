import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", className = "", ...props }) => {
    const base =
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40";
    const styles = {
        primary: "bg-teal-600 text-white hover:bg-teal-700 hover:scale-[1.02] focus-visible:outline-teal-500 shadow-md hover:shadow-lg",
        secondary: "bg-white border border-teal-600 text-teal-700 hover:bg-teal-50 focus-visible:outline-teal-300",
        danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-400",
        ghost: "bg-transparent text-teal-700 hover:bg-teal-50 focus-visible:outline-teal-300",
    }[variant];
    return <button className={[base, styles, className].join(" ")} {...props} />;
};
