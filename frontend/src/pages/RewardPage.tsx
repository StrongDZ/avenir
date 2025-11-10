import React from "react";
import { RewardCenter } from "../components/rewards/RewardCenter";
import { useRewardContext } from "../contexts/RewardContext";

export const RewardPage: React.FC = () => {
    const { overview, loading } = useRewardContext();
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-white">Rewards</h2>
                <p className="text-sm text-slate-300">View your balance and transaction history.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30">
                <RewardCenter data={overview} loading={loading} />
            </div>
        </div>
    );
};
