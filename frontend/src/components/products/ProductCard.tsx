import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/product";
import { Button } from "../common/Button";
import { formatCurrencyVnd } from "../../utils/formatCurrency";

interface Props {
    product: Product;
    onAdd?: (id: string) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onAdd }) => {
    const navigate = useNavigate();
    const [adding, setAdding] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);

    const handleAdd = async () => {
        if (!onAdd || adding) return;
        setAdding(true);
        try {
            await onAdd(product.id);
            setTimeout(() => setAdding(false), 800);
        } catch (e) {
            setAdding(false);
        }
    };

    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click when clicking add button
        handleAdd();
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleCardClick}
            className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition-all ${
                adding ? "ring-2 ring-teal-400 shadow-teal-200" : hovered ? "border-teal-300 shadow-md shadow-teal-100" : "hover:shadow-md"
            } sm:p-6`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-teal-700">
                        {product.brandId}
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-gray-900">{product.name}</div>
                        <div className="mt-2 text-sm text-gray-600">Perfectly paired for mindful routines and holistic wellness boosts.</div>
                    </div>
                </div>
                <div className="text-right text-xl font-semibold text-teal-700">{formatCurrencyVnd(product.price)}</div>
            </div>

            {product.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-gray-600">
                    {product.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                            #{tag}
                        </span>
                    ))}
                </div>
            ) : null}

            {onAdd && (
                <Button
                    onClick={handleAddClick}
                    variant="ghost"
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-md transition ${
                        adding
                            ? "bg-teal-600 text-white hover:bg-teal-600"
                            : "bg-white text-teal-600 border border-teal-600 hover:bg-teal-600 hover:text-white hover:scale-[1.02] hover:shadow-lg"
                    }`}
                    disabled={adding}
                >
                    {adding ? (
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-white" />
                            Added!
                        </span>
                    ) : (
                        <>Add to bundle</>
                    )}
                </Button>
            )}

            <div className="pointer-events-none absolute inset-x-12 bottom-0 h-32 translate-y-1/2 rounded-full bg-teal-100 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
};
