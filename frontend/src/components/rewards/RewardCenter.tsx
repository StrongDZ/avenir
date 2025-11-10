import React from "react";
import { RewardOverview } from "../../types/reward";

export const RewardCenter: React.FC<{ data: RewardOverview | null; loading?: boolean }> = ({ data, loading }) => {
    if (loading) return <div>Loading...</div>;
    if (!data) return null;
    return (
        <div className="space-y-3">
            <div className="font-medium">Balance: {data.balance} pts</div>
            <div>
                <h3 className="font-semibold">History</h3>
                <ul className="space-y-1">
                    {data.transactions.map((t) => (
                        <li key={t.id} className="text-sm">
                            {t.type} {t.points} pts • {new Date(t.created_at).toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
