import { apiClient } from "./apiClient";
import { OrderDetail } from "../types/order";

export interface OrderListResponse {
    items: OrderDetail[];
    total: number;
    page: number;
    pageSize: number;
}

export const orderService = {
    list(userId: string, page = 1, pageSize = 10): Promise<OrderListResponse> {
        return apiClient.get(`/orders?userId=${encodeURIComponent(userId)}&page=${page}&pageSize=${pageSize}`);
    },
    markShipped(orderId: string): Promise<{ orderId: string; status: string }> {
        return apiClient.post(`/orders/${orderId}/ship`);
    },
    confirmReceived(orderId: string, userId: string): Promise<{ orderId: string; status: string }> {
        return apiClient.post(`/orders/${orderId}/receive`, { userId });
    },
    leaveReview(
        orderId: string,
        payload: { userId: string; rating: number; comment?: string }
    ): Promise<{
        orderId: string;
        reviewId: string;
        pointsAwarded: number;
        status: string;
    }> {
        return apiClient.post(`/orders/${orderId}/review`, payload);
    },
};
