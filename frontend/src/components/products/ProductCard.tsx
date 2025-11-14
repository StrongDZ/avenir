import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/product";
import { formatCurrencyVnd } from "../../utils/formatCurrency";

// Import product images
import ProductImg1 from "../../../statics/products/20210615._head_banner_web__b8093e15a30d434c98f7623b1e48314c.jpg";
import ProductImg2 from "../../../statics/Anh-avartar-cocoon.jpg";
import ProductImg3 from "../../../statics/photo-3-1604502916022324847175.jpg";
import ProductImg4 from "../../../statics/review-menu-phe-la-3.jpg";
import ProductImg5 from "../../../statics/review-menu-phe-la-6.jpg";

const productImages = [ProductImg1, ProductImg2, ProductImg3, ProductImg4, ProductImg5];

// Helper to get random image for a product
const getProductImage = (productId: string): string => {
    const index = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return productImages[index % productImages.length];
};

interface Props {
    product: Product;
    onAdd?: (id: string) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onAdd }) => {
    const navigate = useNavigate();
    const productImage = getProductImage(product.id);
    const category = (product.attributes?.category as string) || "";

    const handleCardClick = () => {
        navigate(`/products/${product.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
        >
            {/* Product Image */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img src={productImage} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                {/* Brand Badge */}
                <div className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-teal-700 backdrop-blur-sm">
                    {product.brandId}
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</div>

                {/* Price */}
                <div className="mb-3 text-base font-bold text-teal-700">{formatCurrencyVnd(product.price)}</div>

                {/* Rating and Sold */}
                <div className="mb-2 flex items-center gap-1">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="h-3 w-3 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-xs text-gray-600">10.2k sold</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Hà Nội</span>
                </div>
            </div>
        </div>
    );
};
