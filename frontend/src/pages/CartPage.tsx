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
                    <h2 className="text-2xl font-semibold text-white">Shopping Cart</h2>
                    <p className="text-sm text-slate-300">Your cart is empty</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-12 text-center shadow-2xl shadow-blue-950/30">
                    <div className="text-4xl mb-4">🛒</div>
                    <p className="text-slate-200 mb-6">Looks like you haven&apos;t added anything yet.</p>
                    <Button onClick={() => navigate("/products")}>Browse Products</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-white">Shopping Cart</h2>
                <p className="text-sm text-slate-300">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 md:col-span-2">
                    {items.map((item) => (
                        <div
                            key={item.productId}
                            className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg shadow-blue-950/30 transition hover:border-white/20 hover:shadow-blue-900/30"
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="flex-1">
                                    <div className="text-lg font-semibold text-white">{item.product?.name || item.productId}</div>
                                    <div className="text-xs uppercase tracking-[0.3em] text-blue-200/70 mt-1">{item.product?.brandId || ""}</div>
                                    <div className="mt-4 flex flex-wrap items-center gap-4">
                                        <div className="text-sm font-semibold text-blue-300">
                                            {item.product?.price ? formatCurrencyVnd(item.product.price) : "N/A"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Qty</span>
                                            <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-slate-900/70">
                                                <button
                                                    className="px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-40"
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
                                                    className="w-16 bg-transparent px-2 py-1 text-center text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                />
                                                <button
                                                    className="px-3 py-2 text-sm text-white transition hover:bg-white/10"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
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
                    <div className="sticky top-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-blue-950/30">
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs uppercase tracking-[0.35em] text-blue-200/70">Order summary</div>
                                <div className="text-2xl font-semibold text-white">{formatCurrencyVnd(subtotal)}</div>
                            </div>
                            <div className="space-y-3 text-sm text-slate-300">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="font-medium text-white">{formatCurrencyVnd(subtotal)}</span>
                                </div>
                                <div className="flex justify-between border-t border-white/5 pt-3">
                                    <span className="font-semibold text-white">Total</span>
                                    <span className="font-semibold text-blue-300">{formatCurrencyVnd(subtotal)}</span>
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
