import React from "react";
import { useReward } from "../hooks/useReward";
import { RewardOverview } from "../types/reward";
import { OrderSummary } from "../types/order";

interface RewardContextValue {
    overview: RewardOverview | null;
    loading: boolean;
    refresh: () => Promise<void>;
    checkout: (redeemPoints: number) => Promise<OrderSummary>;
}

export const RewardContext = React.createContext<RewardContextValue | undefined>(undefined);

export const RewardProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
    const reward = useReward(userId);
    return <RewardContext.Provider value={reward}>{children}</RewardContext.Provider>;
};

export function useRewardContext() {
    const ctx = React.useContext(RewardContext);
    if (!ctx) throw new Error("RewardContext not available");
    return ctx;
}
