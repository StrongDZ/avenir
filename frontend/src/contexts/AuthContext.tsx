import React from "react";
import { authService } from "../services/authService";

interface AuthUser {
    id: string;
    username?: string;
    isGuest?: boolean;
}

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    loginAsGuest: () => void;
    logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

function persistUser(user: AuthUser | null, token?: string) {
    if (!user) {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("isGuest");
        return;
    }
    localStorage.setItem("userId", user.id);
    if (user.username) localStorage.setItem("username", user.username);
    else localStorage.removeItem("username");
    if (token) localStorage.setItem("token", token);
    if (user.isGuest) localStorage.setItem("isGuest", "true");
    else localStorage.removeItem("isGuest");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<AuthUser | null>(null);
    const [loading, setLoading] = React.useState(true);

    const applyUser = React.useCallback((next: AuthUser | null, token?: string) => {
        setUser(next);
        persistUser(next, token);
    }, []);

    React.useEffect(() => {
        const storedId = localStorage.getItem("userId");
        const storedUsername = localStorage.getItem("username") || undefined;
        const token = localStorage.getItem("token");
        const isGuest = localStorage.getItem("isGuest") === "true";

        if (storedId && isGuest) {
            setUser({ id: storedId, username: storedUsername, isGuest: true });
            setLoading(false);
            return;
        }

        if (storedId) {
            setUser({ id: storedId, username: storedUsername });
        }
        if (token) {
            authService
                .me()
                .then((me) => {
                    if (me?.id) applyUser({ id: me.id, username: me.username, isGuest: false });
                })
                .catch(() => {
                    applyUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [applyUser]);

    const login = React.useCallback(
        async (username: string, password: string) => {
            const res = await authService.login(username, password);
            const authUser: AuthUser = { id: res.user.id, username: res.user.username ?? username, isGuest: false };
            applyUser(authUser, res.token);
        },
        [applyUser]
    );

    const register = React.useCallback(
        async (username: string, password: string) => {
            const res = await authService.register(username, password);
            const authUser: AuthUser = { id: res.user.id, username: res.user.username ?? username, isGuest: false };
            applyUser(authUser, res.token);
        },
        [applyUser]
    );

    const loginAsGuest = React.useCallback(() => {
        const guestId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const authUser: AuthUser = { id: guestId, isGuest: true };
        applyUser(authUser);
    }, [applyUser]);

    const logout = React.useCallback(() => {
        applyUser(null);
    }, [applyUser]);

    const value = React.useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            login,
            register,
            loginAsGuest,
            logout,
        }),
        [user, loading, login, register, loginAsGuest, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error("AuthContext is not available");
    return ctx;
}
