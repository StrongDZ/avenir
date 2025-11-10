import { Link, NavLink, useNavigate } from "react-router-dom";
import React from "react";
import { useCartContext } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Chatbot } from "./Chatbot";

const navItems = [
    { label: "Products", to: "/products" },
    { label: "Cart", to: "/cart", badge: true },
];

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { items } = useCartContext();
    const cartCount = React.useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        function handleKey(event: KeyboardEvent) {
            if (event.key === "Escape") setMenuOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    const initials = React.useMemo(() => (user?.username ? user.username.slice(0, 2).toUpperCase() : ""), [user?.username]);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute bottom-16 right-[-120px] h-64 w-80 rotate-12 rounded-full bg-purple-500/10 blur-2xl" />
            </div>
            <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
                    <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-base font-bold text-white shadow-lg shadow-blue-500/30">
                            AV
                        </span>
                        <div className="leading-tight">
                            <div className="text-sm uppercase tracking-[0.35em] text-blue-200/80">Avenir</div>
                            <div className="text-xs text-slate-300">Wellness, rewards & lifestyle hub</div>
                        </div>
                    </Link>
                    <nav className="hidden items-center gap-4 text-sm font-medium sm:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    [
                                        "relative rounded-full px-4 py-2 transition",
                                        isActive
                                            ? "bg-white/10 text-white shadow-inner shadow-blue-500/20"
                                            : "text-slate-300 hover:text-white hover:bg-white/5",
                                    ].join(" ")
                                }
                            >
                                <span className="flex items-center gap-2">
                                    {item.label}
                                    {item.badge && cartCount > 0 && (
                                        <span className="pointer-events-none inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </span>
                            </NavLink>
                        ))}
                        <Link
                            to="/recommend"
                            className="hidden rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:scale-105 hover:shadow-purple-500/30 sm:inline-flex"
                        >
                            Smart match
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                                >
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-semibold uppercase text-white">
                                        {initials || "U"}
                                    </span>
                                    <span className="hidden sm:inline">{user.username}</span>
                                    <svg
                                        className={`h-3 w-3 transition ${menuOpen ? "rotate-180" : ""}`}
                                        viewBox="0 0 12 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 1.5L6 6.5L11 1.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-blue-900/40">
                                        <div className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">Account</div>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                navigate("/account");
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
                                        >
                                            Account info
                                        </button>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                navigate("/orders");
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
                                        >
                                            Order history
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white/40 hover:bg-white/10"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/login?mode=register"
                                    className="rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-blue-500/40 transition hover:scale-[1.02] hover:shadow-purple-500/30"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="mx-auto min-h-[calc(100vh-200px)] w-full max-w-6xl px-5 py-10">
                <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur transition hover:border-white/10 hover:bg-white/10">
                    <div className="rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-[1px]">
                        <div className="rounded-[28px] bg-slate-950/60 p-6 shadow-2xl shadow-blue-950/30">{children}</div>
                    </div>
                </div>
            </main>
            <footer className="border-t border-white/5 py-8">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <div>© {new Date().getFullYear()} Avenir. Designed for modern wellness journeys.</div>
                    <div className="flex gap-4">
                        <a className="hover:text-white" href="/products">
                            Shop
                        </a>
                        <a className="hover:text-white" href="/recommend">
                            Personalize
                        </a>
                        <a className="hover:text-white" href="/rewards">
                            Earn Rewards
                        </a>
                    </div>
                </div>
            </footer>
            <Chatbot />
        </div>
    );
};
