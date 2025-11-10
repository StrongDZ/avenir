import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import { Button } from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";

export const LoginPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { notify } = useNotification();
    const { login, register, user } = useAuth();

    const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
    const initialMode = query.get("mode") === "register" ? "register" : "login";

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [mode, setMode] = React.useState<"login" | "register">(initialMode);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const current = query.get("mode") === "register" ? "register" : "login";
        if (current !== mode) setMode(current);
    }, [query, mode]);

    React.useEffect(() => {
        if (user) navigate("/", { replace: true });
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (mode === "login") {
                await login(username, password);
            } else {
                await register(username, password);
            }
            notify(`${mode === "login" ? "Logged in" : "Registered"} successfully`, "success");
            setPassword("");
            navigate("/");
        } catch (e: any) {
            notify(e?.message || "Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMode = () => {
        const next = mode === "login" ? "register" : "login";
        setMode(next);
        navigate(next === "register" ? "?mode=register" : "?mode=login", { replace: true });
    };

    return (
        <div className="mx-auto max-w-md">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-semibold text-white">{mode === "login" ? "Welcome back" : "Join Avenir"}</h2>
                <p className="text-sm text-slate-300">
                    {mode === "login"
                        ? "Sign in to sync your cart, rewards and wellness bundles."
                        : "Create an account to start earning rewards instantly."}
                </p>
            </div>
            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur"
            >
                <label className="block text-left text-sm font-semibold text-slate-200">
                    Username
                    <input
                        className="mt-2 w-full rounded-full border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                        placeholder="yourusername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label className="block text-left text-sm font-semibold text-slate-200">
                    Password
                    <input
                        className="mt-2 w-full rounded-full border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button disabled={loading} className="w-full sm:w-auto">
                        {loading ? "..." : mode === "login" ? "Login" : "Register"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleToggleMode} className="w-full sm:w-auto">
                        Switch to {mode === "login" ? "Register" : "Login"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
