import { apiClient } from "./apiClient";

export interface CartItemDto {
    productId: string;
    quantity: number;
    product?: any;
}

export const cartService = {
    get(userId: string): Promise<{ items: CartItemDto[] }> {
        return apiClient.get(`/cart?userId=${encodeURIComponent(userId)}`);
    },
    add(userId: string, productId: string, quantity = 1): Promise<{ ok: boolean }> {
        return apiClient.post(`/cart/add`, { userId, productId, quantity });
    },
    updateQuantity(userId: string, productId: string, quantity: number): Promise<{ ok: boolean }> {
        return apiClient.post(`/cart/update`, { userId, productId, quantity });
    },
    remove(userId: string, productId: string): Promise<{ ok: boolean }> {
        return apiClient.post(`/cart/remove`, { userId, productId });
    },
};
