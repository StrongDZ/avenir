import React from "react";
import { rewardService } from "../services/rewardService";
import { RewardOverview } from "../types/reward";
import { OrderSummary } from "../types/order";

export function useReward(userId: string) {
    const [overview, setOverview] = React.useState<RewardOverview | null>(null);
    const [loading, setLoading] = React.useState(false);

    const refresh = React.useCallback(async () => {
        setLoading(true);
        const data = await rewardService.overview(userId);
        setOverview(data);
        setLoading(false);
    }, [userId]);

    const checkout = React.useCallback(
        async (redeemPoints: number): Promise<OrderSummary> => {
            const summary = await rewardService.checkout(userId, redeemPoints);
            await refresh();
            return summary;
        },
        [userId, refresh]
    );

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    return { overview, loading, refresh, checkout };
}
