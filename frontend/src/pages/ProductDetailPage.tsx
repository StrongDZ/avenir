import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { Product } from "../types/product";
import { Button } from "../components/common/Button";
import { Loader } from "../components/common/Loader";
import { formatCurrencyVnd } from "../utils/formatCurrency";
import { useCartContext } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";

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

    const attributes = product.attributes || {};
    const benefits = (attributes.benefits as string[]) || [];
    const symptoms = (attributes.symptom as string[]) || [];
    const wellness = (attributes.wellness as string[]) || [];
    const diet = (attributes.diet as string[]) || [];

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/products")} className="text-teal-700 hover:text-teal-800">
                    ← Back to Products
                </Button>
            </div>

            {/* Product Details */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                {/* Left: Product Info */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-teal-700">
                            {product.brandId}
                        </div>
                        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">{product.name}</h1>
                        <div className="mb-6 text-3xl font-semibold text-teal-700">{formatCurrencyVnd(product.price)}</div>
                        <p className="mb-6 text-gray-600">
                            Perfectly paired for mindful routines and holistic wellness boosts. This premium product is designed to complement your
                            wellness journey.
                        </p>

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <Button
                            onClick={handleAdd}
                            disabled={adding}
                            className={`w-full rounded-full px-6 py-4 text-lg font-semibold shadow-md transition ${
                                adding ? "bg-teal-600 hover:bg-teal-600" : "bg-teal-600 hover:bg-teal-700 hover:scale-[1.02]"
                            }`}
                        >
                            {adding ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-white" />
                                    Added to Cart!
                                </span>
                            ) : (
                                "Add to Cart"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Right: Attributes & Details */}
                <div className="space-y-6">
                    {/* Benefits */}
                    {benefits.length > 0 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Benefits</h2>
                            <div className="flex flex-wrap gap-2">
                                {benefits.map((benefit, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700"
                                    >
                                        {benefit}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Wellness */}
                    {wellness.length > 0 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Wellness Support</h2>
                            <div className="flex flex-wrap gap-2">
                                {wellness.map((item, idx) => (
                                    <span key={idx} className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-700">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Symptoms */}
                    {symptoms.length > 0 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Target Symptoms</h2>
                            <div className="flex flex-wrap gap-2">
                                {symptoms.map((symptom, idx) => (
                                    <span key={idx} className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm text-purple-700">
                                        {symptom}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Diet */}
                    {diet.length > 0 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Diet Compatibility</h2>
                            <div className="flex flex-wrap gap-2">
                                {diet.map((item, idx) => (
                                    <span key={idx} className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Attributes */}
                    {Object.keys(attributes).length > 0 && (
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-gray-900">Product Attributes</h2>
                            <div className="space-y-2 text-sm text-gray-600">
                                {Object.entries(attributes).map(([key, value]) => (
                                    <div key={key} className="flex items-start gap-2">
                                        <span className="font-semibold text-teal-700">{key}:</span>
                                        <span className="text-gray-700">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
