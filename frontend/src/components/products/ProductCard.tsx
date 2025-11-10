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
            className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-lg shadow-blue-950/20 transition-all ${
                adding ? "ring-2 ring-green-400/80 shadow-green-500/30" : hovered ? "border-white/20 shadow-blue-900/40" : ""
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-200/80">
                        {product.brandId}
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-white">{product.name}</div>
                        <div className="mt-2 text-sm text-slate-300/80">Perfectly paired for mindful routines and holistic wellness boosts.</div>
                    </div>
                </div>
                <div className="text-right text-xl font-semibold text-blue-300">{formatCurrencyVnd(product.price)}</div>
            </div>

            {product.tags?.length ? (
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-200/80">
                    {product.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1">
                            #{tag}
                        </span>
                    ))}
                </div>
            ) : null}

            {onAdd && (
                <Button
                    onClick={handleAddClick}
                    variant="ghost"
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-lg shadow-blue-900/30 transition ${
                        adding ? "bg-green-500 hover:bg-green-500" : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:scale-[1.02]"
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

            <div className="pointer-events-none absolute inset-x-12 bottom-0 h-32 translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
};
