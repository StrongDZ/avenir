import { apiClient } from "./apiClient";
import { RewardOverview } from "../types/reward";
import { OrderSummary } from "../types/order";

export const rewardService = {
    overview(userId: string): Promise<RewardOverview> {
        return apiClient.get(`/rewards?userId=${encodeURIComponent(userId)}`);
    },
    checkout(userId: string, redeemPoints: number): Promise<OrderSummary> {
        return apiClient.post(`/checkout`, { userId, redeemPoints });
    },
};
