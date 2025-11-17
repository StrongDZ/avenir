import React from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";
import { CartItem } from "../components/cart/CartItem";
import { CartSummary } from "../components/cart/CartSummary";
import { Button } from "../components/common/Button";
import { formatCurrencyVnd } from "../utils/formatCurrency";
import { Loader } from "../components/common/Loader";

// Import product images
import ProductImg1 from "../assets/products/20210615._head_banner_web__b8093e15a30d434c98f7623b1e48314c.jpg";
import ProductImg2 from "../assets/Anh-avartar-cocoon.jpg";
import ProductImg3 from "../assets/photo-3-1604502916022324847175.jpg";
import ProductImg4 from "../assets/review-menu-phe-la-3.jpg";
import ProductImg5 from "../assets/review-menu-phe-la-6.jpg";

const productImages = [ProductImg1, ProductImg2, ProductImg3, ProductImg4, ProductImg5];

// Helper to get random image for a product
const getProductImage = (productId: string): string => {
    const index = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return productImages[index % productImages.length];
};

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
                <h2 className="text-2xl font-bold text-teal-700">Shopping Cart</h2>
                <p className="text-sm text-gray-600">
                    {itemCount} {itemCount === 1 ? "item" : "items"} - Total {formatCurrencyVnd(subtotal)}
                </p>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <svg className="h-5 w-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <span className="text-sm text-gray-700">Arrives by April 3 to April 9th</span>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4 md:col-span-2">
                    {items.map((item) => {
                        const productImage = getProductImage(item.productId);
                        const hasBestSeller = item.product?.tags?.includes("best-seller") || item.product?.tags?.includes("bestseller");
                        return (
                            <div
                                key={item.productId}
                                className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md sm:p-6"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    {/* Product Image */}
                                    <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-40 sm:w-40">
                                        <img src={productImage} alt={item.product?.name || item.productId} className="h-full w-full object-cover" />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex flex-1 flex-col gap-3">
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="text-lg font-semibold text-gray-900">{item.product?.name || item.productId}</div>
                                                    {hasBestSeller && (
                                                        <div className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                                                            Best-seller
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {item.product?.tags && item.product.tags.length > 0 && (
                                                <div className="mt-2 text-sm text-gray-600">
                                                    {item.product.tags
                                                        .filter((tag: string) => tag !== "best-seller" && tag !== "bestseller")
                                                        .slice(0, 2)
                                                        .join(" • ")}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-base font-semibold text-orange-600">
                                            {item.product?.price ? formatCurrencyVnd(item.product.price) : "N/A"}
                                        </div>

                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600">Quantity:</span>
                                            <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
                                                <button
                                                    className="px-3 py-2 text-sm text-gray-700 transition hover:bg-teal-50 hover:text-teal-700 disabled:opacity-40"
                                                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        if (val > 0) updateQuantity(item.productId, val);
                                                    }}
                                                    className="w-16 bg-transparent px-2 py-2 text-center text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                                />
                                                <button
                                                    className="px-3 py-2 text-sm text-gray-700 transition hover:bg-teal-50 hover:text-teal-700"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <div className="sticky top-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">Total</div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                </button>
                            </div>
                            <div className="text-2xl font-semibold text-orange-600">{formatCurrencyVnd(subtotal)}</div>
                            <Button onClick={() => navigate("/checkout")} className="w-full bg-teal-600 hover:bg-teal-700">
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
