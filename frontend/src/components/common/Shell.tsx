import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { useCartContext } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Chatbot } from "./Chatbot";

const navItems = [
    { label: "Products", to: "/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    {
        label: "Cart",
        to: "/cart",
        badge: true,
        icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
        label: "Smart match",
        to: "/recommend",
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
];

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { items } = useCartContext();
    const cartCount = React.useMemo(() => items.reduce((sum: number, item: any) => sum + item.quantity, 0), [items]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const mobileMenuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
        }
        function handleKey(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMenuOpen(false);
                setMobileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, []);

    // Close mobile menu when route changes
    React.useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const initials = React.useMemo(() => (user?.username ? user.username.slice(0, 2).toUpperCase() : "GU"), [user?.username]);
    const isGuest = user?.isGuest;

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        setMobileMenuOpen(false);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Decorative background elements */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-teal-100 blur-3xl" />
                <div className="absolute bottom-16 right-[-120px] h-64 w-80 rotate-12 rounded-full bg-teal-50 blur-2xl" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-bold text-white shadow-md sm:h-10 sm:w-10 sm:text-base">
                            AV
                        </div>
                        <div className="text-sm font-bold text-teal-700 sm:text-base">AVENIR</div>
                    </Link>

                    {/* Desktop navigation */}
                    <nav className="hidden items-center gap-3 text-sm font-medium sm:flex">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    [
                                        "relative rounded-full px-4 py-2 transition",
                                        isActive ? "bg-teal-100 text-teal-700 font-semibold" : "text-gray-600 hover:text-teal-700 hover:bg-teal-50",
                                    ].join(" ")
                                }
                            >
                                <span className="flex items-center gap-2">
                                    {item.label}
                                    {item.badge && cartCount > 0 && (
                                        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-teal-600 text-[10px] font-semibold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Mobile & Desktop: Right side icons */}
                    <div className="flex items-center gap-2">
                        {/* Mobile: Hamburger menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center rounded-full p-2 text-teal-700 hover:bg-teal-50 sm:hidden"
                            aria-label="Menu"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>

                        {/* Desktop: Cart icon */}
                        <Link
                            to="/cart"
                            className="hidden relative items-center justify-center rounded-full p-2 text-teal-700 hover:bg-teal-50 sm:inline-flex"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-teal-600 text-[10px] font-semibold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User account menu */}
                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    className="inline-flex items-center justify-center rounded-full p-2 text-teal-700 hover:bg-teal-50"
                                    aria-label="Account"
                                >
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-xs font-semibold uppercase text-white">
                                        {initials}
                                    </span>
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                                        {isGuest && <div className="border-b border-gray-100 px-4 py-2 text-xs text-gray-500">Guest Mode</div>}
                                        {!isGuest && (
                                            <>
                                                <div className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-gray-400">Account</div>
                                                <button
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        navigate("/account");
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-teal-50"
                                                >
                                                    Account info
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        navigate("/orders");
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-teal-50"
                                                >
                                                    Order history
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                                        >
                                            {isGuest ? "Exit Guest Mode" : "Log out"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="rounded-full border border-teal-600 bg-white px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 sm:px-4"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/login?mode=register"
                                    className="hidden rounded-full bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-teal-700 sm:block sm:px-4"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                {mobileMenuOpen && (
                    <div ref={mobileMenuRef} className="border-t border-gray-200 bg-white sm:hidden">
                        <div className="mx-auto max-w-6xl px-4 py-3">
                            <nav className="space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-teal-50 hover:text-teal-700"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                        <span>{item.label}</span>
                                        {item.badge && cartCount > 0 && (
                                            <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-teal-600 text-[10px] font-semibold text-white">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}
            </header>

            {/* Main content */}
            <main className="mx-auto min-h-[calc(100vh-120px)] w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-6">{children}</main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-6">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>© {new Date().getFullYear()} Avenir. Designed for modern wellness journeys.</div>
                    <div className="flex gap-4">
                        <Link to="/products" className="hover:text-teal-700">
                            Shop
                        </Link>
                        <Link to="/recommend" className="hover:text-teal-700">
                            Personalize
                        </Link>
                        <Link to="/rewards" className="hover:text-teal-700">
                            Earn Rewards
                        </Link>
                    </div>
                </div>
            </footer>
            <Chatbot />
        </div>
    );
};
