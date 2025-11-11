import React from "react";
import { RewardCenter } from "../components/rewards/RewardCenter";
import { useRewardContext } from "../contexts/RewardContext";

export const RewardPage: React.FC = () => {
    const { overview, loading } = useRewardContext();
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Rewards</h2>
                <p className="text-sm text-gray-600">View your balance and transaction history.</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <RewardCenter data={overview} loading={loading} />
            </div>
        </div>
    );
};
