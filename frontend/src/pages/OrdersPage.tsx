import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import { Button } from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "../components/common/Loader";
import { orderService } from "../services/orderService";
import { OrderDetail } from "../types/order";

interface ReviewDraft {
    rating: number;
    comment: string;
}

export const OrdersPage: React.FC = () => {
    const [orders, setOrders] = React.useState<OrderDetail[]>([]);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [actionLoading, setActionLoading] = React.useState<string | null>(null);
    const [reviewing, setReviewing] = React.useState<string | null>(null);
    const [reviewDraft, setReviewDraft] = React.useState<ReviewDraft>({ rating: 5, comment: "" });
    const pageSize = 10;
    const { notify } = useNotification();
    const { user } = useAuth();
    const navigate = useNavigate();
    const warnedRef = React.useRef(false);

    const refresh = React.useCallback(
        async (nextPage = page) => {
            if (!user) return;
            setLoading(true);
            try {
                const res = await orderService.list(user.id, nextPage, pageSize);
                setOrders(res.items);
                setTotal(res.total);
                setPage(res.page);
            } catch (e: any) {
                notify(e?.message || "Failed to load orders", "error");
            } finally {
                setLoading(false);
            }
        },
        [user, notify, page, pageSize]
    );

    React.useEffect(() => {
        if (!user) {
            if (!warnedRef.current) {
                notify("Please login first", "error");
                warnedRef.current = true;
            }
            navigate("/login");
            return;
        }
        warnedRef.current = false;
        refresh(1);
    }, [user?.id, navigate, notify, refresh]);

    const setPageSafe = (nextPage: number) => {
        refresh(nextPage);
    };

    const handleShip = async (orderId: string) => {
        setActionLoading(orderId);
        try {
            await orderService.markShipped(orderId);
            await refresh();
            notify("Order marked as shipped", "success");
        } catch (e: any) {
            notify(e?.message || "Failed to mark shipped", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReceived = async (orderId: string) => {
        if (!user) return;
        setActionLoading(orderId);
        try {
            await orderService.confirmReceived(orderId, user.id);
            await refresh();
            notify("Order marked as delivered", "success");
        } catch (e: any) {
            notify(e?.message || "Failed to confirm receipt", "error");
        } finally {
            setActionLoading(null);
        }
    };

    const handleSubmitReview = async (orderId: string) => {
        if (!user) return;
        setActionLoading(orderId);
        try {
            await orderService.leaveReview(orderId, {
                userId: user.id,
                rating: reviewDraft.rating,
                comment: reviewDraft.comment,
            });
            setReviewing(null);
            setReviewDraft({ rating: 5, comment: "" });
            await refresh();
            notify("Review submitted and points awarded", "success");
        } catch (e: any) {
            notify(e?.message || "Failed to submit review", "error");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Order history</h2>
                <p className="text-sm text-gray-600">Keep track of your past purchases and fulfillment status.</p>
            </div>
            <div className="space-y-4">
                {loading ? (
                    <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
                        <Loader text="Loading your past orders..." />
                    </div>
                ) : orders.length > 0 ? (
                    orders.map((o) => (
                        <div
                            key={o.id}
                            className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="mt-1 text-sm uppercase tracking-[0.35em] text-teal-600">Order #{o.id.slice(0, 8)}</div>
                                    <div className="text-lg font-semibold text-gray-900">{new Date(o.createdAt).toLocaleString()}</div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <div className="text-sm font-semibold text-teal-700">Total: {o.total.toLocaleString()} VND</div>
                                    <div className="text-xs uppercase tracking-[0.35em] text-gray-500">Status: {o.status}</div>
                                </div>
                            </div>
                            <div className="mt-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 text-xs text-gray-600">
                                Items: {o.items.map((i) => `${i.productId} ×${i.quantity}`).join(", ")}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {o.status === "Processing" && (
                                    <Button variant="secondary" onClick={() => handleShip(o.id)} disabled={actionLoading === o.id}>
                                        {actionLoading === o.id ? "Updating..." : "Simulate seller shipped"}
                                    </Button>
                                )}
                                {o.status === "Shipped" && (
                                    <Button onClick={() => handleReceived(o.id)} disabled={actionLoading === o.id}>
                                        {actionLoading === o.id ? "Updating..." : "Confirm received"}
                                    </Button>
                                )}
                                {(o.status === "Delivered" || o.status === "Shipped") && (
                                    <Button variant="secondary" onClick={() => setReviewing((prev) => (prev === o.id ? null : o.id))}>
                                        {reviewing === o.id ? "Cancel review" : "Leave review"}
                                    </Button>
                                )}
                            </div>
                            {reviewing === o.id && (
                                <div className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                                    <div className="font-semibold text-gray-900">Review your experience</div>
                                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                                        Rating (1-5)
                                        <input
                                            type="number"
                                            min={1}
                                            max={5}
                                            value={reviewDraft.rating}
                                            onChange={(e) => setReviewDraft((draft) => ({ ...draft, rating: Number(e.target.value) }))}
                                            className="mt-1 w-full rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                        />
                                    </label>
                                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
                                        Comment
                                        <textarea
                                            value={reviewDraft.comment}
                                            onChange={(e) => setReviewDraft((draft) => ({ ...draft, comment: e.target.value }))}
                                            rows={3}
                                            className="mt-1 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                            placeholder="Share thoughts for bonus points..."
                                        />
                                    </label>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" onClick={() => setReviewing(null)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={() => handleSubmitReview(o.id)} disabled={actionLoading === o.id}>
                                            {actionLoading === o.id ? "Submitting..." : "Submit review"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-600">
                        You don&apos;t have any orders yet. Checkout a bundle to see it here.
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                    Page {page} / {Math.max(1, Math.ceil(total / pageSize))} • {total} orders
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setPageSafe(Math.max(1, page - 1))} disabled={page <= 1 || loading}>
                        Prev
                    </Button>
                    <Button variant="secondary" onClick={() => setPageSafe(page + 1)} disabled={page >= Math.ceil(total / pageSize) || loading}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};
