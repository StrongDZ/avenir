import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { Product } from "../types/product";
import { useCartContext } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";
import { formatCurrencyVnd } from "../utils/formatCurrency";

// Banner images (randomized on each reload)
import Img1 from "../assets/photo-3-1604502916022324847175.jpg";
import Img2 from "../assets/review-menu-phe-la-3.jpg";
import Img3 from "../assets/review-menu-phe-la-6.jpg";
import Img4 from "../assets/Anh-avartar-cocoon.jpg";
import Img5 from "../assets/20210615._head_banner_web__b8093e15a30d434c98f7623b1e48314c.jpg";

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

const categories = [
    { id: "combo", name: "Combo", icon: "🍱", color: "bg-green-100 text-green-700" },
    { id: "drinks", name: "Drinks", icon: "🥤", color: "bg-orange-100 text-orange-700" },
    { id: "foods", name: "Foods", icon: "🍞", color: "bg-yellow-100 text-yellow-700" },
    { id: "skincare", name: "Skincare", icon: "🧴", color: "bg-purple-100 text-purple-700" },
    { id: "spa", name: "Spa", icon: "💆", color: "bg-teal-100 text-teal-700" },
];

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { add } = useCartContext();
    const { notify } = useNotification();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [slides, setSlides] = React.useState<string[]>([]);
    const [active, setActive] = React.useState(0);

    React.useEffect(() => {
        productService
            .list()
            .then((products) => {
                // Get first 6 products as featured
                setFeaturedProducts(products.slice(0, 6));
            })
            .catch(() => setFeaturedProducts([]))
            .finally(() => setLoading(false));
    }, []);

    // Prepare randomized banner slides (up to 5)
    React.useEffect(() => {
        const all = [Img1, Img2, Img3, Img4, Img5];
        // Shuffle
        for (let i = all.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [all[i], all[j]] = [all[j], all[i]];
        }
        setSlides(all.slice(0, 5));
        setActive(0);
    }, []);

    // Auto play slideshow
    React.useEffect(() => {
        if (slides.length === 0) return;
        const id = window.setInterval(() => {
            setActive((idx) => (idx + 1) % slides.length);
        }, 4000);
        return () => window.clearInterval(id);
    }, [slides.length]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            // If empty search, navigate to products page to show suggestions
            navigate(`/products`);
        }
    };

    const handleAddToCart = async (productId: string) => {
        try {
            await add(productId, 1);
            const product = featuredProducts.find((p) => p.id === productId);
            notify(`Added ${product?.name || "product"} to cart`, "success");
        } catch (error) {
            notify("Failed to add product", "error");
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full">
                <div className="relative flex items-center rounded-full border border-gray-300 bg-white px-4 py-3 shadow-sm focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Product Name"
                        className="ml-3 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    />
                    <button
                        type="button"
                        className="ml-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-teal-700"
                        aria-label="Camera search"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </form>

            {/* Promotional Banner - Slideshow */}
            <div className="relative overflow-hidden rounded-2xl">
                <div className="relative h-56 w-full sm:h-72 md:h-80">
                    {slides.map((src, idx) => (
                        <div
                            key={src + idx}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${active === idx ? "opacity-100" : "opacity-0"}`}
                            style={{
                                backgroundImage: `url(${src})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    ))}

                    {/* Overlay gradient and text */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-end">
                        <div className="p-6 sm:p-8">
                            <h3 className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl">FEATURED COLLECTION</h3>
                            <p className="mt-2 text-sm sm:text-base text-teal-50 drop-shadow">Discover our most loved products</p>
                        </div>
                    </div>
                </div>

                {/* Dots */}
                {slides.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => setActive(i)}
                                className={`h-1.5 rounded-full transition-all ${active === i ? "w-5 bg-white" : "w-2 bg-white/60 hover:bg-white"}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Categories */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Categories</h2>
                    <Link to="/products" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                        See All
                    </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/products?category=${category.id}`}
                            className="flex min-w-[80px] flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                        >
                            <div className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl ${category.color}`}>
                                {category.icon}
                            </div>
                            <span className="text-xs font-medium text-gray-700">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Featured Product</h2>
                    <Link to="/products" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                        See All
                    </Link>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-300 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {featuredProducts.map((product) => {
                            const productImage = getProductImage(product.id);
                            return (
                                <div
                                    key={product.id}
                                    className="min-w-[160px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md cursor-pointer"
                                    onClick={() => navigate(`/products/${product.id}`)}
                                >
                                    <div className="mb-2 h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                                        <img src={productImage} alt={product.name} className="h-full w-full object-cover" />
                                    </div>
                                    <h3 className="mb-1 text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                                    <div className="mb-2 flex items-center gap-1">
                                        <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-xs text-gray-600">4.6</span>
                                        <span className="text-xs text-gray-400">(86 Reviews)</span>
                                    </div>
                                    <div className="mb-2 text-base font-bold text-teal-700">{formatCurrencyVnd(product.price)}</div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product.id);
                                        }}
                                        className="w-full rounded-lg bg-teal-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};
