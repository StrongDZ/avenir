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
                <h2 className="text-2xl font-bold text-gray-900">Account</h2>
                <p className="text-sm text-gray-600">Sign in to view your profile, preferences and reward progress.</p>
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

    const getUserInitials = () => {
        if (user.username) {
            return user.username.slice(0, 2).toUpperCase();
        }
        if (user.email) {
            return user.email.slice(0, 2).toUpperCase();
        }
        return "U";
    };

    const getUserDisplayName = () => {
        return user.username || user.email?.split("@")[0] || "User";
    };

    const getMembershipLevel = (points: number) => {
        if (points >= 10000) return "GOLDEN MEMBERSHIP";
        if (points >= 5000) return "SILVER MEMBERSHIP";
        if (points >= 1000) return "BRONZE MEMBERSHIP";
        return "MEMBER";
    };

    const formatTransactionDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return `Today ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
        } else if (diffDays === 1) {
            return `Yesterday ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
        } else {
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
        }
    };

    const points = overview?.balance ?? 0;
    const membership = getMembershipLevel(points);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Section - Dark Purple Background */}
            <div className="bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 px-4 pt-4 pb-8">
                {/* Header with profile and icons */}
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 flex items-center justify-between">
                        {/* Profile Section */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-purple-700 text-lg font-semibold text-white">
                                        {getUserInitials()}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-white">Welcome back!</div>
                                <div className="text-base font-semibold text-gray-200">{getUserDisplayName()}</div>
                            </div>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-3">
                            <button className="rounded-full p-2 text-white hover:bg-white/10">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                            </button>
                            <button className="rounded-full p-2 text-white hover:bg-white/10">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Rewards Points Display */}
                    <div className="mx-auto text-center">
                        <div className="mb-2 text-sm text-white/80">My Rewards Points</div>
                        <div className="mb-1 text-xs text-white/70">Earned Points</div>
                        <div className="mb-3 text-6xl font-bold text-teal-400">{rewardsLoading ? "…" : points.toLocaleString()}</div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-yellow-400">{membership}</div>
                    </div>

                    {/* Achievements Button */}
                    <div className="mx-auto mt-6 max-w-md">
                        <button
                            onClick={() => navigate("/rewards")}
                            className="flex w-full items-center justify-between rounded-2xl bg-teal-500 px-4 py-3 text-left text-white shadow-lg transition hover:bg-teal-600"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                                <div>
                                    <div className="font-semibold">Achievements</div>
                                    <div className="text-xs text-white/80">You get points from Phê La - 300pts</div>
                                </div>
                            </div>
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section - White Background */}
            <div className="mx-auto max-w-6xl px-4 pb-8 pt-6">
                {/* Latest Transactions */}
                <section className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Latest Transactions</h3>
                        <button onClick={() => navigate("/rewards")} className="text-sm text-gray-500 hover:text-gray-700">
                            See all
                        </button>
                    </div>

                    {rewardsLoading ? (
                        <div className="py-6">
                            <Loader text="Loading transactions..." />
                        </div>
                    ) : overview?.transactions?.length ? (
                        <div className="space-y-3">
                            {overview.transactions.slice(0, 5).map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:bg-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                tx.type === "earn" ? "bg-amber-100" : "bg-red-100"
                                            }`}
                                        >
                                            {tx.type === "earn" ? (
                                                <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {tx.meta?.merchant
                                                    ? `${tx.meta.merchant} - ${tx.meta.location || ""}`
                                                    : tx.type === "earn"
                                                    ? "Points Earned"
                                                    : "Points Redeemed"}
                                            </div>
                                            <div className="text-xs text-gray-500">{formatTransactionDate(tx.created_at)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-semibold ${tx.type === "earn" ? "text-teal-600" : "text-red-600"}`}>
                                            {tx.type === "earn" ? "+" : "-"}
                                            {tx.points.toLocaleString()}pts
                                        </span>
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
                            No transactions yet. Complete your first checkout to start earning points.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};
