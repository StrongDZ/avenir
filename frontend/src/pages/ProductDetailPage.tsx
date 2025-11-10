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
                <p className="text-slate-300">Product not found</p>
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate("/products")} className="text-slate-300 hover:text-white">
                    ← Back to Products
                </Button>
            </div>

            {/* Product Details */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Left: Product Info */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-blue-950/30">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/80">
                            {product.brandId}
                        </div>
                        <h1 className="mb-4 text-4xl font-bold text-white">{product.name}</h1>
                        <div className="mb-6 text-3xl font-semibold text-blue-300">{formatCurrencyVnd(product.price)}</div>
                        <p className="mb-6 text-slate-300">
                            Perfectly paired for mindful routines and holistic wellness boosts. This premium product is designed to complement your
                            wellness journey.
                        </p>

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-slate-200/80"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <Button
                            onClick={handleAdd}
                            disabled={adding}
                            className={`w-full rounded-full px-6 py-4 text-lg font-semibold shadow-lg transition ${
                                adding
                                    ? "bg-green-500 hover:bg-green-500"
                                    : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:scale-[1.02]"
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
                        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30">
                            <h2 className="mb-4 text-xl font-semibold text-white">Benefits</h2>
                            <div className="flex flex-wrap gap-2">
                                {benefits.map((benefit, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300"
                                    >
                                        {benefit}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Wellness */}
                    {wellness.length > 0 && (
                        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30">
                            <h2 className="mb-4 text-xl font-semibold text-white">Wellness Support</h2>
                            <div className="flex flex-wrap gap-2">
                                {wellness.map((item, idx) => (
                                    <span key={idx} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Symptoms */}
                    {symptoms.length > 0 && (
                        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30">
                            <h2 className="mb-4 text-xl font-semibold text-white">Target Symptoms</h2>
                            <div className="flex flex-wrap gap-2">
                                {symptoms.map((symptom, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300"
                                    >
                                        {symptom}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Diet */}
                    {diet.length > 0 && (
                        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30">
                            <h2 className="mb-4 text-xl font-semibold text-white">Diet Compatibility</h2>
                            <div className="flex flex-wrap gap-2">
                                {diet.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Attributes (for debugging/development) */}
                    {Object.keys(attributes).length > 0 && (
                        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30">
                            <h2 className="mb-4 text-xl font-semibold text-white">Product Attributes</h2>
                            <div className="space-y-2 text-sm text-slate-300">
                                {Object.entries(attributes).map(([key, value]) => (
                                    <div key={key} className="flex items-start gap-2">
                                        <span className="font-semibold text-blue-300">{key}:</span>
                                        <span className="text-slate-200">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
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
