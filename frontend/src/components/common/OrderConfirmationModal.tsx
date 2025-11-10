import React from "react";
import { Button } from "./Button";

interface OrderConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    order: {
        orderId: string;
        subtotal: number;
        discountVnd: number;
        total: number;
        earned: number;
        status: string;
    } | null;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ open, onClose, order }) => {
    // Debug log - log in render to catch all renders
    console.log("[OrderConfirmationModal] Render - open:", open, "order:", order);

    React.useEffect(() => {
        console.log("[OrderConfirmationModal] useEffect - open:", open);
        if (open) {
            console.log("[OrderConfirmationModal] Modal should be open, order:", order);
        }
    }, [open, order]);

    if (!open) {
        console.log("[OrderConfirmationModal] Early return: open is false");
        return null;
    }
    if (!order) {
        console.warn("[OrderConfirmationModal] Modal is open but order is null");
        return null;
    }

    console.log("[OrderConfirmationModal] Rendering modal content");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/95 to-slate-900/95 shadow-2xl shadow-blue-950/50">
                <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/60 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-white">Order Confirmed!</h3>
                            <p className="mt-1 text-sm text-blue-50/80">Your payment was successful</p>
                        </div>
                        <button onClick={onClose} className="rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                        <div className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-200/70">Order Details</div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-300">Order ID</span>
                                <span className="font-mono font-semibold text-white">#{order.orderId.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-300">Subtotal</span>
                                <span className="font-semibold text-white">{order.subtotal.toLocaleString()} VND</span>
                            </div>
                            {order.discountVnd > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-300">Discount</span>
                                    <span className="font-semibold text-emerald-300">-{order.discountVnd.toLocaleString()} VND</span>
                                </div>
                            )}
                            <div className="border-t border-white/10 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-white">Total</span>
                                    <span className="text-lg font-bold text-blue-300">{order.total.toLocaleString()} VND</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 p-4">
                        <div className="mb-2 text-xs uppercase tracking-[0.35em] text-emerald-200/80">Rewards Earned</div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-200">Points added to your account</span>
                            <span className="text-xl font-bold text-emerald-300">+{order.earned.toLocaleString()} pts</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <Button onClick={onClose} className="w-full">
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
