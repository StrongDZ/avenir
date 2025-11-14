import React from "react";
import { useNavigate } from "react-router-dom";
import { useRewardContext } from "../contexts/RewardContext";
import { useCartContext } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/common/Button";
import { Loader } from "../components/common/Loader";
import { productService } from "../services/productService";
import { Product } from "../types/product";
import { formatCurrencyVnd } from "../utils/formatCurrency";

// Import product images
import ProductImg1 from "../../statics/products/20210615._head_banner_web__b8093e15a30d434c98f7623b1e48314c.jpg";
import ProductImg2 from "../../statics/Anh-avartar-cocoon.jpg";
import ProductImg3 from "../../statics/photo-3-1604502916022324847175.jpg";
import ProductImg4 from "../../statics/review-menu-phe-la-3.jpg";
import ProductImg5 from "../../statics/review-menu-phe-la-6.jpg";

const productImages = [ProductImg1, ProductImg2, ProductImg3, ProductImg4, ProductImg5];

// Helper to get random image for a product
const getProductImage = (productId: string): string => {
    const index = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return productImages[index % productImages.length];
};

const REDEEM_RATE_VND_PER_POINT = 1; // 1 point = 1 VND (1:1 ratio)

export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { checkout, overview, loading: rewardLoading, refresh } = useRewardContext();
    const { items: cartItems, refresh: refreshCart, loading: cartLoading } = useCartContext();
    const [redeem, setRedeem] = React.useState(0);
    const [result, setResult] = React.useState<any | null>(null);
    const [submitting, setSubmitting] = React.useState(false);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = React.useState(true);
    const balance = overview?.balance ?? 0;

    // Redirect to login if user is a guest
    React.useEffect(() => {
        if (!user || user.isGuest) {
            navigate("/login?redirect=/checkout", { replace: true });
        }
    }, [user, navigate]);

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

    // Navigate to confirmation page when result is set
    React.useEffect(() => {
        if (result) {
            console.log("Result is set, navigating to confirmation:", result);
            navigate("/order-confirmation", { state: { order: result }, replace: true });
        }
    }, [result, navigate]);

    const submit = async () => {
        setSubmitting(true);
        setResult(null);
        try {
            const redeemValue = Math.max(0, Math.min(balance, redeem));
            const r = await checkout(redeemValue);
            console.log("Checkout result:", r);
            // Refresh data first
            await refresh();
            await refreshCart(); // Refresh cart to clear it
            // Set result - useEffect will automatically navigate to confirmation page
            setResult(r);
        } catch (e: any) {
            // In current flow payments always succeed, but handle just in case
            console.error("Checkout error:", e);
            alert(`Checkout failed: ${e.message || "Unknown error"}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (rewardLoading && !overview) {
        return (
            <div className="py-20">
                <Loader text="Preparing your checkout..." />
            </div>
        );
    }

    const [billingSameAsDelivery, setBillingSameAsDelivery] = React.useState(true);

    if (cartItems.length === 0 && !cartLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Checkout</h2>
                    <p className="text-sm text-gray-600">Your cart is empty. Add some products to continue.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-2xl font-semibold text-teal-700">Checkout</h2>
            </div>

            {/* Shipping Information */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Shipping</h3>
                    <button className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                        <span>Add / Edit</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                {user && !user.isGuest && (
                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="font-semibold text-gray-900">{user.username || "User"}</div>
                        <div>{user.email || "No email"}</div>
                        <div>{user.phone || "No phone"}</div>
                        <div className="whitespace-pre-line">{user.address || "No address"}</div>
                    </div>
                )}
                <div className="mt-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="billing-same"
                        checked={billingSameAsDelivery}
                        onChange={(e) => setBillingSameAsDelivery(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor="billing-same" className="text-sm text-gray-700">
                        Billing and delivery addresses are same.
                    </label>
                </div>
            </div>

            {/* Payment Section */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Payment</h3>
                    <button className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
                        <span>Add / Edit</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-16 items-center justify-center rounded bg-gray-100">
                        <span className="text-xs font-semibold text-gray-600">CARD</span>
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">My Virtual Debit Card</div>
                        <div className="text-xs text-gray-600">**** **** **** 8553</div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{orderSummary.itemsWithDetails.length} items</h3>
                    <div className="rounded-lg bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-800">Arrives by April 3 to April 9th</div>
                </div>
                {productsLoading ? (
                    <div className="py-8 text-center">
                        <Loader text="Loading items..." />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orderSummary.itemsWithDetails.map((item) => {
                            const productImage = getProductImage(item.productId);
                            const weight = item.product?.attributes?.weight;
                            return (
                                <div key={item.productId} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4">
                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                        <img src={productImage} alt={item.product?.name || "Product"} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{item.product?.name || "Unknown Product"}</div>
                                        <div className="mt-1 text-xs text-gray-600">Net Weight: {weight ? String(weight) : "N/A"}</div>
                                        <div className="mt-1 text-xs text-gray-600">Quantity: {item.quantity}</div>
                                        <div className="mt-2 font-semibold text-gray-900">{formatCurrencyVnd(item.itemTotal)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Order Summary & Redeem Points */}
            <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>

                <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-900">{formatCurrencyVnd(orderSummary.subtotal)}</span>
                    </div>
                    {orderSummary.discountVnd > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Discount (from {redeem.toLocaleString()} pts)</span>
                            <span className="font-semibold text-teal-600">-{formatCurrencyVnd(orderSummary.discountVnd)}</span>
                        </div>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <div className="text-sm font-semibold text-gray-700">Redeem Points</div>
                        <input
                            className="mt-2 w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                            type="number"
                            min={0}
                            max={balance}
                            value={redeem}
                            onChange={(e) => setRedeem(Math.min(balance, Math.max(0, Number(e.target.value))))}
                        />
                        <div className="mt-2 text-xs text-gray-500">
                            Each point = {formatCurrencyVnd(REDEEM_RATE_VND_PER_POINT)}. You can redeem up to your available balance.
                        </div>
                    </label>
                    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                        <div className="flex items-center justify-between">
                            <span>Available</span>
                            <span className="font-semibold text-gray-900">{balance.toLocaleString()} pts</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Redeeming</span>
                            <span className="font-semibold text-teal-600">{redeem.toLocaleString()} pts</span>
                        </div>
                        {orderSummary.discountVnd > 0 && (
                            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                                <span>Discount</span>
                                <span className="font-semibold text-teal-600">-{formatCurrencyVnd(orderSummary.discountVnd)}</span>
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
            </div>

            {/* Total and Pay Now */}
            <div className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">{formatCurrencyVnd(orderSummary.total)}</div>
                    </div>
                    <Button onClick={submit} disabled={submitting || cartItems.length === 0} className="bg-teal-600 hover:bg-teal-700">
                        {submitting ? "Processing..." : "Pay Now"}
                    </Button>
                </div>
            </div>

            <p className="text-center text-xs text-gray-500">
                This is the final step, after you touching Pay Now button, the payment will be transaction.
            </p>
        </div>
    );
};
