import React from "react";
import { useHealthInput } from "../hooks/useHealthInput";
import { useRecommendation } from "../hooks/useRecommendation";
import { HealthInputForm } from "../components/forms/HealthInputForm";
import { ProductList } from "../components/products/ProductList";
import { BundleSuggestion } from "../components/products/BundleSuggestion";
import { useCartContext } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";

export const RecommendationPage: React.FC = () => {
    const { form, update } = useHealthInput();
    const { data, loading, fetchRecommendations } = useRecommendation();
    const { add } = useCartContext();
    const { notify } = useNotification();

    const handleAdd = async (productId: string) => {
        const product =
            data?.primary.find((p) => p.id === productId) ||
            Object.values(data?.bundles || {})
                .flat()
                .find((p) => p.id === productId);
        await add(productId, 1);
        notify(`Added ${product?.name || "product"} to cart`, "success");
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-white">Health-based Recommendations</h2>
                <p className="text-sm text-slate-300">Answer a few quick questions to personalize your picks.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-blue-950/30">
                <HealthInputForm value={form} onChange={update} onSubmit={() => fetchRecommendations(form)} loading={loading} />
            </div>
            {data && (
                <div className="space-y-4">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">Primary</h3>
                        <ProductList products={data.primary} onAdd={handleAdd} />
                    </div>
                    <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">Bundle Suggestions</h3>
                        <BundleSuggestion bundles={data.bundles} onAdd={handleAdd} />
                    </div>
                </div>
            )}
        </div>
    );
};
