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
                <h2 className="text-2xl font-bold text-gray-900">Health-based Recommendations</h2>
                <p className="text-sm text-gray-600">Answer a few quick questions to personalize your picks.</p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <HealthInputForm value={form} onChange={update} onSubmit={() => fetchRecommendations(form)} loading={loading} />
            </div>
            {data && (
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Primary</h3>
                        <ProductList products={data.primary} onAdd={handleAdd} />
                    </div>
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Bundle Suggestions</h3>
                        <BundleSuggestion bundles={data.bundles} onAdd={handleAdd} />
                    </div>
                </div>
            )}
        </div>
    );
};
