import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/common/Button";
import { formatCurrencyVnd } from "../utils/formatCurrency";
import { OrderSummary } from "../types/order";

export const OrderConfirmationPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.order as OrderSummary | undefined;

    React.useEffect(() => {
        if (!orderData) {
            // Redirect to home if no order data
            navigate("/", { replace: true });
        }
    }, [orderData, navigate]);

    if (!orderData) {
        return null;
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-2xl px-4 py-8">
                {/* Payment Successful Card */}
                <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
                    {/* Success Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-600">
                            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="mb-3 text-center text-3xl font-bold text-teal-700">Payment Successful!</h1>
                    <p className="mb-6 text-center text-sm text-gray-600">
                        Thank you for your shopping. Your order has been successfully placed and has been processed for delivery.
                    </p>

                    {/* Divider */}
                    <div className="mb-6 border-t border-teal-200"></div>

                    {/* Order Summary */}
                    <div className="mb-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
                            <span className="text-sm text-gray-600">{orderData.itemCount} Item(s)</span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Item(s) subtotal</span>
                                <span className="font-semibold text-gray-900">{formatCurrencyVnd(orderData.subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold text-gray-900">{formatCurrencyVnd(orderData.shippingCost)}</span>
                            </div>
                            {orderData.discountVnd > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-semibold text-teal-600">-{formatCurrencyVnd(orderData.discountVnd)}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="text-bold text-gray-600">Total:</div>
                                <div className="text-lg font-bold text-gray-900">{formatCurrencyVnd(orderData.total + orderData.shippingCost)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="mb-6 space-y-3 border-t border-gray-200 pt-6 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Transaction ID</span>
                            <span className="font-mono font-semibold text-gray-900">{orderData.transactionId}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="font-semibold text-gray-900">Debit Card</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Date</span>
                            <span className="font-semibold text-gray-900">{formatDate(orderData.date)}</span>
                        </div>
                    </div>

                    {/* Points Earned */}
                    {orderData.earned > 0 && (
                        <div className="rounded-2xl bg-teal-50 p-4 text-center">
                            <div className="text-sm font-semibold text-teal-700">+{orderData.earned.toLocaleString()} redeem points</div>
                        </div>
                    )}
                </div>

                {/* Continue Shopping Button */}
                <div className="mb-8">
                    <Button variant="secondary" onClick={() => navigate("/")} className="w-full border-2">
                        Continue Shopping
                    </Button>
                </div>

                {/* You can also like this */}
                <div className="mb-4">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">You can also like this</h3>
                    {/* Search bar placeholder */}
                    <div className="mb-4 flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="flex-1 text-sm text-gray-500">www.avenir.com</span>
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
