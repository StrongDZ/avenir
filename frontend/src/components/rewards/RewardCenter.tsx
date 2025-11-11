import React from "react";
import { RewardOverview } from "../../types/reward";
import { Loader } from "../common/Loader";

export const RewardCenter: React.FC<{ data: RewardOverview | null; loading?: boolean }> = ({ data, loading }) => {
    if (loading) return <Loader text="Loading rewards..." />;
    if (!data) return null;
    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs uppercase tracking-[0.35em] text-teal-600">Balance</div>
                <div className="mt-2 text-3xl font-bold text-teal-700">{data.balance} pts</div>
            </div>
            <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">History</h3>
                <ul className="space-y-2">
                    {data.transactions.length > 0 ? (
                        data.transactions.map((t) => (
                            <li key={t.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3 text-sm">
                                <div>
                                    <div className="font-medium text-gray-900 capitalize">{t.type}</div>
                                    <div className="text-xs text-gray-500">{new Date(t.created_at).toLocaleString()}</div>
                                </div>
                                <div className={`font-semibold ${t.type === "earn" ? "text-teal-600" : "text-red-600"}`}>
                                    {t.type === "earn" ? "+" : "-"}
                                    {t.points} pts
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-600">
                            No transactions yet
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};
