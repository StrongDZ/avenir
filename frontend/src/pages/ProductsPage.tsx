import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { Product } from "../types/product";
import { ProductList } from "../components/products/ProductList";
import { useCartContext } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";
import { Loader } from "../components/common/Loader";
import { formatCurrencyVnd } from "../utils/formatCurrency";

const pageSize = 9;

type SortOption = "relevance" | "latest" | "top-sales" | "price";

export const ProductsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
    const brandParam = query.get("brand") || "";
    const categoryParam = query.get("category") || "";

    const { add } = useCartContext();
    const { notify } = useNotification();

    const [search, setSearch] = React.useState(query.get("q") || "");
    const [brandSearch, setBrandSearch] = React.useState(brandParam);
    const [page, setPage] = React.useState(Number(query.get("page")) || 1);
    const [sortBy, setSortBy] = React.useState<SortOption>((query.get("sort") as SortOption) || "relevance");
    const [loading, setLoading] = React.useState(true);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [total, setTotal] = React.useState(0);
    const [showFilter, setShowFilter] = React.useState(false);

    React.useEffect(() => {
        const qValue = query.get("q") || "";
        if (qValue !== search) setSearch(qValue);
        const brandValue = query.get("brand") || "";
        if (brandValue !== brandSearch) setBrandSearch(brandValue);
        const pageValue = Number(query.get("page") || "1");
        if (!Number.isNaN(pageValue) && pageValue !== page) {
            setPage(Math.max(1, pageValue));
        }
        const sortValue = (query.get("sort") as SortOption) || "relevance";
        if (sortValue !== sortBy) setSortBy(sortValue);
    }, [query, search, brandSearch, page, sortBy]);

    React.useEffect(() => {
        setLoading(true);
        productService
            .search({ q: search, brand: brandSearch, page, pageSize })
            .then((res) => {
                let sortedProducts = [...res.items];
                // Apply sorting
                switch (sortBy) {
                    case "price":
                        sortedProducts.sort((a, b) => a.price - b.price);
                        break;
                    case "latest":
                        sortedProducts.sort((a, b) => (b.id > a.id ? 1 : -1));
                        break;
                    case "top-sales":
                        // Mock sorting by price (in real app, would use sales data)
                        sortedProducts.sort((a, b) => b.price - a.price);
                        break;
                    default:
                        // relevance - keep original order
                        break;
                }
                setProducts(sortedProducts);
                setTotal(res.total);
            })
            .finally(() => setLoading(false));
    }, [search, brandSearch, page, pageSize, sortBy]);

    const syncNavigate = React.useCallback(
        ({
            searchValue,
            brandValue,
            pageValue,
            sortValue,
        }: {
            searchValue?: string;
            brandValue?: string;
            pageValue?: number;
            sortValue?: SortOption;
        }) => {
            const nextSearch = searchValue !== undefined ? searchValue : search;
            const nextBrand = brandValue !== undefined ? brandValue : brandSearch;
            const nextPage = pageValue !== undefined ? pageValue : page;
            const nextSort = sortValue !== undefined ? sortValue : sortBy;
            const params = new URLSearchParams();
            if (nextSearch) params.set("q", nextSearch);
            if (nextBrand) params.set("brand", nextBrand);
            if (nextPage > 1) params.set("page", nextPage.toString());
            if (nextSort !== "relevance") params.set("sort", nextSort);
            const target = params.toString();
            navigate(target ? `?${target}` : ".", { replace: false });
        },
        [navigate, search, brandSearch, page, sortBy]
    );

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
        syncNavigate({ searchValue: value, pageValue: 1 });
    };

    const handleSortChange = (sort: SortOption) => {
        setSortBy(sort);
        syncNavigate({ sortValue: sort });
    };

    const goToPage = (nextPage: number) => {
        const safePage = Math.max(1, Math.min(Math.ceil(total / pageSize), nextPage));
        if (safePage === page) return;
        setPage(safePage);
        syncNavigate({ pageValue: safePage });
    };

    const handleAdd = async (productId: string) => {
        const product = products.find((p) => p.id === productId);
        await add(productId, 1);
        notify(`Added ${product?.name || "product"} to cart`, "success");
    };

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="space-y-4">
            {/* Search Bar with Filter */}
            <div className="sticky top-16 z-20 -mx-4 bg-white px-4 pb-3 pt-2 sm:static sm:mx-0 sm:px-0">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearchChange(search);
                    }}
                    className="relative flex items-center gap-2"
                >
                    <button type="button" onClick={() => navigate(-1)} className="rounded-full p-2 text-teal-700 hover:bg-teal-50 sm:hidden">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex flex-1 items-center rounded-full border border-gray-300 bg-white px-4 py-2.5 shadow-sm focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="ml-3 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            placeholder="Search products..."
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilter(!showFilter)}
                        className="rounded-full border border-teal-600 bg-teal-600 p-2.5 text-white hover:bg-teal-700"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {(["relevance", "latest", "top-sales", "price"] as SortOption[]).map((sort) => (
                    <button
                        key={sort}
                        onClick={() => handleSortChange(sort)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                            sortBy === sort ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {sort === "relevance" ? "Relevance" : sort === "latest" ? "Latest" : sort === "top-sales" ? "Top Sales" : "Price"}
                    </button>
                ))}
            </div>

            {/* Products List */}
            {loading ? (
                <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                    <Loader text="Fetching fresh picks for you..." />
                </div>
            ) : products.length > 0 ? (
                <ProductList products={products} onAdd={handleAdd} />
            ) : (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-600">
                    No products match your filters yet. Try clearing the search or exploring another category.
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm sm:flex-row">
                    <div>
                        Page {page} / {totalPages} • {total} items
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50 disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
                            onClick={() => goToPage(page - 1)}
                            disabled={page <= 1}
                        >
                            Prev
                        </button>
                        <button
                            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-teal-500 hover:text-teal-700 hover:bg-teal-50 disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
                            onClick={() => goToPage(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
