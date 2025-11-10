import { apiClient } from "./apiClient";

export const authService = {
    register(username: string, password: string): Promise<{ token: string; user: { id: string; username?: string } }> {
        return apiClient.post("/auth/register", { username, password });
    },
    login(username: string, password: string): Promise<{ token: string; user: { id: string; username?: string } }> {
        return apiClient.post("/auth/login", { username, password });
    },
    me(): Promise<{ id: string; username?: string }> {
        return apiClient.get("/auth/me");
    },
};
