import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { Product } from "../types/product";
import { Button } from "../components/common/Button";
import { Loader } from "../components/common/Loader";
import { formatCurrencyVnd } from "../utils/formatCurrency";
import { useCartContext } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";

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

export const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { add } = useCartContext();
    const { notify } = useNotification();
    const [product, setProduct] = React.useState<Product | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [adding, setAdding] = React.useState(false);

    React.useEffect(() => {
        if (!id) {
            navigate("/products");
            return;
        }
        setLoading(true);
        productService
            .getById(id)
            .then(setProduct)
            .catch((e) => {
                console.error("Failed to load product:", e);
                notify("Product not found", "error");
                navigate("/products");
            })
            .finally(() => setLoading(false));
    }, [id, navigate, notify]);

    const handleAdd = async () => {
        if (!product || adding) return;
        setAdding(true);
        try {
            await add(product.id, 1);
            notify(`Added ${product.name} to cart`, "success");
        } catch (e) {
            notify("Failed to add product to cart", "error");
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20">
                <Loader text="Loading product details..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="py-20 text-center">
                <p className="text-gray-600">Product not found</p>
                <Button onClick={() => navigate("/products")} className="mt-4">
                    Back to Products
                </Button>
            </div>
        );
    }

    const productImage = getProductImage(product.id);
    const category = (product.attributes?.category as string) || "";

    return (
        <div className="space-y-5 pb-10">
            <div className="flex items-center justify-between">
                <button onClick={() => navigate("/products")} className="rounded-full border border-gray-200 p-2 text-teal-700 hover:border-teal-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1">
                        <svg className="h-3 w-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        24/7
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1">
                        <svg className="h-3 w-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2m0 0h13.2a1 1 0 01.98 1.197l-1.5 8A1 1 0 0117.1 15H6.9a1 1 0 01-.98-.803L4.4 5zM16 19a1 1 0 100 2 1 1 0 000-2zm-8 0a1 1 0 100 2 1 1 0 000-2z"
                            />
                        </svg>
                        Fast delivery
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative h-56 w-full overflow-hidden">
                    <img src={productImage} alt={product.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-sm uppercase tracking-[0.35em] text-amber-200">Fresh & Healthy</p>
                        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{product.name}</h1>
                    </div>
                </div>

                <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">
                                {category || "Premium"}
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500">Free Gift</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className="h-4 w-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="ml-1 text-xs text-gray-600">(56)</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Price</p>
                            <div className="text-2xl font-bold text-teal-700">{formatCurrencyVnd(product.price)}</div>
                        </div>
                    </div>

                    {product.description && (
                        <div className="space-y-2 rounded-2xl bg-teal-50/70 p-4 text-sm text-gray-700">
                            {product.description
                                .split(".")
                                .map((sentence) => sentence.trim())
                                .filter(Boolean)
                                .map((sentence, idx) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className="text-lg leading-none">🍞</span>
                                        <p>{sentence}.</p>
                                    </div>
                                ))}
                        </div>
                    )}

                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Hà Nội
                        </div>
                        <div className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H4a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Snap Food
                        </div>
                    </div>

                    <Button
                        onClick={handleAdd}
                        disabled={adding}
                        className="w-full rounded-xl py-3 text-base font-semibold shadow-md transition hover:scale-[1.01]"
                    >
                        {adding ? "Adding..." : "Add to cart"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
