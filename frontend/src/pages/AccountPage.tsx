import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/common/Button";
import { useRewardContext } from "../contexts/RewardContext";
import { Loader } from "../components/common/Loader";

export const AccountPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { overview, loading: rewardsLoading, refresh } = useRewardContext();

    React.useEffect(() => {
        if (user) {
            refresh();
        }
    }, [user?.id, refresh]);

    if (!user) {
        return (
            <div className="space-y-6 text-center">
                <h2 className="text-2xl font-semibold text-white">Account</h2>
                <p className="text-sm text-slate-300">Sign in to view your profile, preferences and reward progress.</p>
                <div className="flex justify-center gap-3">
                    <Button onClick={() => navigate("/login")} className="px-6">
                        Login
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/login?mode=register")}>
                        Register
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-white">Account overview</h2>
                <p className="text-sm text-slate-300">Manage your credentials and explore personalized perks.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg shadow-blue-950/30">
                    <div className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Username</div>
                    <div className="mt-2 text-lg font-semibold text-white">{user.username}</div>
                    <p className="mt-2 text-xs text-slate-400">Share this handle with concierge support for faster onboarding.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg shadow-blue-950/30">
                    <div className="text-xs uppercase tracking-[0.35em] text-blue-200/70">User ID</div>
                    <div className="mt-2 text-lg font-semibold text-white">{user.id}</div>
                    <p className="mt-2 text-xs text-slate-400">We use this identifier to sync carts, orders and reward ledgers.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg shadow-blue-950/30">
                    <div className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Reward balance</div>
                    <div className="mt-2 text-lg font-semibold text-white">
                        {rewardsLoading ? "…" : `${overview?.balance?.toLocaleString() ?? 0} pts`}
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                        Points automatically apply as discounts during checkout. Earn more by completing purchases and leaving reviews.
                    </p>
                </div>
            </div>
            <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-white">Recent reward activity</h3>
                        <p className="text-xs text-slate-400">Track how your wellness purchases translate into redeemable perks.</p>
                    </div>
                    <Button variant="ghost" onClick={refresh} className="text-xs uppercase tracking-wide">
                        Refresh
                    </Button>
                </header>
                {rewardsLoading ? (
                    <div className="py-6">
                        <Loader text="Syncing your reward ledger..." />
                    </div>
                ) : overview?.transactions?.length ? (
                    <ul className="space-y-3 text-sm text-slate-200">
                        {overview.transactions.slice(0, 5).map((tx) => (
                            <li key={tx.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/60 px-4 py-3">
                                <div className="space-y-1">
                                    <div className="font-medium capitalize">{tx.type === "earn" ? "Earned" : "Redeemed"}</div>
                                    <div className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleString()}</div>
                                </div>
                                <div className={["text-sm font-semibold", tx.type === "earn" ? "text-emerald-300" : "text-red-300"].join(" ")}>
                                    {tx.type === "earn" ? "+" : "-"}
                                    {tx.points.toLocaleString()} pts
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-sm text-slate-300/80">
                        No reward activity yet. Complete your first checkout to start earning points.
                    </div>
                )}
                <div className="text-xs text-slate-400">
                    Need a detailed statement? Visit the{" "}
                    <button onClick={() => navigate("/rewards")} className="font-semibold text-blue-300 hover:text-white">
                        full rewards dashboard
                    </button>{" "}
                    for a complete transaction history.
                </div>
            </section>
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-6 text-sm text-slate-300/80">
                Looking for your order history? Head to the{" "}
                <button onClick={() => navigate("/orders")} className="font-semibold text-blue-300 hover:text-white">
                    order dashboard
                </button>{" "}
                to review past purchases, download receipts and monitor delivery status.
            </div>
        </div>
    );
};
