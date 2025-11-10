import React from "react";
import { authService } from "../services/authService";

interface AuthUser {
    id: string;
    username?: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

function persistUser(user: AuthUser | null, token?: string) {
    if (!user) {
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        return;
    }
    localStorage.setItem("userId", user.id);
    if (user.username) localStorage.setItem("username", user.username);
    else localStorage.removeItem("username");
    if (token) localStorage.setItem("token", token);
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
        if (storedId) {
            setUser({ id: storedId, username: storedUsername });
        }
        if (token) {
            authService
                .me()
                .then((me) => {
                    if (me?.id) applyUser({ id: me.id, username: me.username });
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
            const authUser: AuthUser = { id: res.user.id, username: res.user.username ?? username };
            applyUser(authUser, res.token);
        },
        [applyUser]
    );

    const register = React.useCallback(
        async (username: string, password: string) => {
            const res = await authService.register(username, password);
            const authUser: AuthUser = { id: res.user.id, username: res.user.username ?? username };
            applyUser(authUser, res.token);
        },
        [applyUser]
    );

    const logout = React.useCallback(() => {
        applyUser(null);
    }, [applyUser]);

    const value = React.useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            login,
            register,
            logout,
        }),
        [user, loading, login, register, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error("AuthContext is not available");
    return ctx;
}
