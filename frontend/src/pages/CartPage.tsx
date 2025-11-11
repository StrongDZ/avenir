import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { Button } from "../components/common/Button";
import { formatCurrencyVnd } from "../utils/formatCurrency";
import { Loader } from "../components/common/Loader";

export const CartPage: React.FC = () => {
    const { items, loading, updateQuantity, remove } = useCartContext();
    const navigate = useNavigate();

    const subtotal = items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        return sum + price * item.quantity;
    }, 0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    if (loading) {
        return <Loader text="Loading cart..." />;
    }

    if (items.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                    <p className="text-sm text-gray-600">Your cart is empty</p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                    <div className="mb-4 text-4xl">🛒</div>
                    <p className="mb-6 text-gray-700">Looks like you haven&apos;t added anything yet.</p>
                    <Button onClick={() => navigate("/products")}>Browse Products</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <p className="text-sm text-gray-600">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 md:col-span-2">
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md sm:p-6"
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="flex-1">
                                    <div className="text-lg font-semibold text-gray-900">{item.product?.name || item.productId}</div>
                                    <div className="mt-1 text-xs uppercase tracking-[0.3em] text-teal-600">{item.product?.brandId || ""}</div>
                                    <div className="mt-4 flex flex-wrap items-center gap-4">
                                        <div className="text-sm font-semibold text-teal-700">
                                            {item.product?.price ? formatCurrencyVnd(item.product.price) : "N/A"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs uppercase tracking-[0.3em] text-gray-500">Qty</span>
                                            <div className="flex items-center overflow-hidden rounded-full border border-gray-300 bg-gray-50">
                                                <button
                                                    className="px-3 py-2 text-sm text-gray-700 transition hover:bg-teal-50 hover:text-teal-700 disabled:opacity-40"
                                                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        if (val > 0) updateQuantity(item.productId, val);
                                                    }}
                                                    className="w-16 bg-transparent px-2 py-1 text-center text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                                />
                                                <button
                                                    className="px-3 py-2 text-sm text-gray-700 transition hover:bg-teal-50 hover:text-teal-700"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                                            Subtotal: {item.product?.price ? formatCurrencyVnd(item.product.price * item.quantity) : "N/A"}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="danger" onClick={() => remove(item.productId)} className="shrink-0">
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="sticky top-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs uppercase tracking-[0.35em] text-teal-600">Order summary</div>
                                <div className="text-2xl font-semibold text-gray-900">{formatCurrencyVnd(subtotal)}</div>
                            </div>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatCurrencyVnd(subtotal)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-3">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="font-semibold text-teal-700">{formatCurrencyVnd(subtotal)}</span>
                                </div>
                            </div>
                            <Button onClick={() => navigate("/checkout")} className="w-full">
                                Proceed to Checkout
                            </Button>
                            <Button variant="secondary" onClick={() => navigate("/products")} className="w-full">
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
