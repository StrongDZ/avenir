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
    React.useEffect(() => {
        if (open) {
            console.log("[OrderConfirmationModal] Modal should be open, order:", order);
        }
    }, [open, order]);

    if (!open) {
        return null;
    }
    if (!order) {
        console.warn("[OrderConfirmationModal] Modal is open but order is null");
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-white">Order Confirmed!</h3>
                            <p className="mt-1 text-sm text-teal-50">Your payment was successful</p>
                        </div>
                        <button onClick={onClose} className="rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <div className="mb-3 text-xs uppercase tracking-[0.35em] text-teal-600">Order Details</div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Order ID</span>
                                <span className="font-mono font-semibold text-gray-900">#{order.orderId.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-900">{order.subtotal.toLocaleString()} VND</span>
                            </div>
                            {order.discountVnd > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-semibold text-teal-600">-{order.discountVnd.toLocaleString()} VND</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-lg font-bold text-teal-700">{order.total.toLocaleString()} VND</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
                        <div className="mb-2 text-xs uppercase tracking-[0.35em] text-teal-700">Rewards Earned</div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Points added to your account</span>
                            <span className="text-xl font-bold text-teal-700">+{order.earned.toLocaleString()} pts</span>
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
