import { apiClient } from "./apiClient";

export const authService = {
    register(
        username: string,
        password: string,
        confirmPassword: string,
        email: string,
        phone: string,
        address: string
    ): Promise<{ token: string; user: { id: string; username?: string; email?: string; phone?: string; address?: string } }> {
        return apiClient.post("/auth/register", { username, password, confirmPassword, email, phone, address });
    },
    login(
        username: string,
        password: string
    ): Promise<{ token: string; user: { id: string; username?: string; email?: string; phone?: string; address?: string } }> {
        return apiClient.post("/auth/login", { username, password });
    },
    me(): Promise<{ id: string; username?: string; email?: string; phone?: string; address?: string }> {
        return apiClient.get("/auth/me");
    },
};
