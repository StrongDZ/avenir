import React from "react";
import { Product } from "../../types/product";
import { ProductCard } from "./ProductCard";

interface Props {
    products: Product[];
    onAdd?: (id: string) => void;
}

export const ProductList: React.FC<Props> = ({ products, onAdd }) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={onAdd} />
            ))}
        </div>
    );
};
