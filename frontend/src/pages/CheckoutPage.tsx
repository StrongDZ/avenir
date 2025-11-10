import React from "react";
import { useNavigate } from "react-router-dom";
import { useRewardContext } from "../contexts/RewardContext";
import { useCartContext } from "../contexts/CartContext";
import { Button } from "../components/common/Button";
import { Loader } from "../components/common/Loader";
import { OrderConfirmationModal } from "../components/common/OrderConfirmationModal";
import { productService } from "../services/productService";
import { Product } from "../types/product";
import { formatCurrencyVnd } from "../utils/formatCurrency";

const REDEEM_RATE_VND_PER_POINT = 1; // 1 point = 1 VND (1:1 ratio)

export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { checkout, overview, loading: rewardLoading, refresh } = useRewardContext();
    const { items: cartItems, refresh: refreshCart, loading: cartLoading } = useCartContext();
    const [redeem, setRedeem] = React.useState(0);
    const [result, setResult] = React.useState<any | null>(null);
    const [submitting, setSubmitting] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = React.useState(true);
    const balance = overview?.balance ?? 0;

    // Fetch product details for cart items
    React.useEffect(() => {
        if (cartItems.length === 0) {
            setProducts([]);
            setProductsLoading(false);
            return;
        }
        setProductsLoading(true);
        const productIds = cartItems.map((item) => item.productId);
        productService
            .list()
            .then((allProducts) => {
                const cartProducts = allProducts.filter((p) => productIds.includes(p.id));
                setProducts(cartProducts);
            })
            .finally(() => setProductsLoading(false));
    }, [cartItems]);

    // Calculate order summary
    const orderSummary = React.useMemo(() => {
        const productMap = new Map(products.map((p) => [p.id, p]));
        let subtotal = 0;
        const itemsWithDetails = cartItems.map((item) => {
            const product = productMap.get(item.productId);
            const itemTotal = (product?.price || 0) * item.quantity;
            subtotal += itemTotal;
            return { ...item, product, itemTotal };
        });

        const discountVnd = redeem * REDEEM_RATE_VND_PER_POINT;
        const total = Math.max(0, subtotal - discountVnd);

        return { itemsWithDetails, subtotal, discountVnd, total };
    }, [cartItems, products, redeem]);

    React.useEffect(() => {
        if (redeem > balance) {
            setRedeem(balance);
        }
    }, [balance]);

    // Show modal when result is set
    React.useEffect(() => {
        if (result) {
            console.log("Result is set, showing modal:", result);
            setShowModal(true);
        }
    }, [result]);

    // Debug: Log props being passed to modal
    React.useEffect(() => {
        console.log("[CheckoutPage] Modal props:", { showModal, result });
    }, [showModal, result]);

    const submit = async () => {
        setSubmitting(true);
        setResult(null);
        setShowModal(false); // Reset modal state
        try {
            const redeemValue = Math.max(0, Math.min(balance, redeem));
            const r = await checkout(redeemValue);
            console.log("Checkout result:", r); // Debug log
            // Refresh data first
            await refresh();
            await refreshCart(); // Refresh cart to clear it
            // Set result - useEffect will automatically show modal
            setResult(r);
        } catch (e: any) {
            // In current flow payments always succeed, but handle just in case
            console.error("Checkout error:", e);
            alert(`Checkout failed: ${e.message || "Unknown error"}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setResult(null);
        setRedeem(0);
        navigate("/"); // Navigate to home page
    };

    if (rewardLoading && !overview) {
        return (
            <div className="py-20">
                <Loader text="Preparing your checkout..." />
            </div>
        );
    }

    if (cartItems.length === 0 && !cartLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-white">Checkout</h2>
                    <p className="text-sm text-slate-300">Your cart is empty. Add some products to continue.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-white">Checkout</h2>
                <p className="text-sm text-slate-300">
                    {balance > 0
                        ? `You have ${balance.toLocaleString()} redeemable points. Apply them below to lower your total.`
                        : "Start earning points by completing an order. Points can be redeemed for discounts here."}
                </p>
            </div>

            {/* Cart Items */}
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30">
                <h3 className="mb-4 text-lg font-semibold text-white">Order Items</h3>
                {productsLoading ? (
                    <div className="py-8 text-center">
                        <Loader text="Loading items..." />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orderSummary.itemsWithDetails.map((item) => (
                            <div
                                key={item.productId}
                                className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/60 p-4"
                            >
                                <div className="flex-1">
                                    <div className="font-medium text-white">{item.product?.name || "Unknown Product"}</div>
                                    <div className="mt-1 text-xs text-slate-400">
                                        {formatCurrencyVnd(item.product?.price || 0)} × {item.quantity}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-white">{formatCurrencyVnd(item.itemTotal)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Summary & Redeem Points */}
            <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30">
                <h3 className="text-lg font-semibold text-white">Order Summary</h3>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Subtotal</span>
                        <span className="font-semibold text-white">{formatCurrencyVnd(orderSummary.subtotal)}</span>
                    </div>
                    {orderSummary.discountVnd > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">Discount (from {redeem.toLocaleString()} pts)</span>
                            <span className="font-semibold text-emerald-300">-{formatCurrencyVnd(orderSummary.discountVnd)}</span>
                        </div>
                    )}
                    <div className="border-t border-white/10 pt-3">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-white">Total</span>
                            <span className="text-lg font-bold text-blue-300">{formatCurrencyVnd(orderSummary.total)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <div className="text-sm font-semibold text-slate-200">Redeem Points</div>
                        <input
                            className="mt-2 w-full rounded-full border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
                            type="number"
                            min={0}
                            max={balance}
                            value={redeem}
                            onChange={(e) => setRedeem(Math.min(balance, Math.max(0, Number(e.target.value))))}
                        />
                        <div className="mt-2 text-xs text-slate-400">
                            Each point = {formatCurrencyVnd(REDEEM_RATE_VND_PER_POINT)}. You can redeem up to your available balance.
                        </div>
                    </label>
                    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
                        <div className="flex items-center justify-between">
                            <span>Available</span>
                            <span className="font-semibold text-white">{balance.toLocaleString()} pts</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Redeeming</span>
                            <span className="font-semibold text-emerald-300">{redeem.toLocaleString()} pts</span>
                        </div>
                        {orderSummary.discountVnd > 0 && (
                            <div className="flex items-center justify-between border-t border-white/10 pt-2">
                                <span>Discount</span>
                                <span className="font-semibold text-emerald-300">-{formatCurrencyVnd(orderSummary.discountVnd)}</span>
                            </div>
                        )}
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                // Only redeem enough to cover the order total, not more
                                const maxRedeem = Math.min(balance, orderSummary.subtotal);
                                setRedeem(maxRedeem);
                            }}
                            disabled={balance === 0 || orderSummary.subtotal === 0}
                            className="mt-auto"
                        >
                            Use max
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <Button onClick={submit} disabled={submitting || cartItems.length === 0}>
                        {submitting ? "Processing..." : "Complete payment"}
                    </Button>
                </div>
            </div>
            <OrderConfirmationModal open={showModal} onClose={handleCloseModal} order={result} />
        </div>
    );
};
