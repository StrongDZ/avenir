import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { Product } from "../types/product";
import { ProductList } from "../components/products/ProductList";
import { useCartContext } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";
import { Loader } from "../components/common/Loader";
import { formatCurrencyVnd } from "../utils/formatCurrency";
import { HealthInput } from "../types/recommendation";

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
    const [allProducts, setAllProducts] = React.useState<Product[]>([]);
    const [total, setTotal] = React.useState(0);
    const [showFilter, setShowFilter] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [filterRef, setFilterRef] = React.useState<HTMLDivElement | null>(null);
    const [filters, setFilters] = React.useState<Partial<HealthInput>>({
        skinType: undefined,
        stressLevel: undefined,
        dietHabit: undefined,
        sleepHours: undefined,
        wellnessGoal: undefined,
    });

    // Close filter dropdown when clicking outside
    React.useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (filterRef && !filterRef.contains(event.target as Node)) {
                setShowFilter(false);
            }
        }
        function handleKey(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setShowFilter(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
        };
    }, [filterRef]);

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

    // Load all products for filtering and suggestions
    React.useEffect(() => {
        productService.list().then(setAllProducts);
    }, []);

    // Filter products based on filters
    const applyFilters = React.useCallback(
        (productsToFilter: Product[]): Product[] => {
            return productsToFilter.filter((product) => {
                const attrs = product.attributes || {};

                if (filters.skinType && attrs.skinType) {
                    const skinTypes = Array.isArray(attrs.skinType) ? attrs.skinType : [attrs.skinType];
                    if (!skinTypes.includes(filters.skinType)) return false;
                }

                if (filters.stressLevel && attrs.wellness) {
                    const wellness = Array.isArray(attrs.wellness) ? attrs.wellness : [attrs.wellness];
                    if (!wellness.includes(filters.stressLevel)) return false;
                }

                if (filters.dietHabit && attrs.diet) {
                    const diet = Array.isArray(attrs.diet) ? attrs.diet : [attrs.diet];
                    if (!diet.includes(filters.dietHabit)) return false;
                }

                if (filters.sleepHours && attrs.sleepRange) {
                    const sleepRange = Array.isArray(attrs.sleepRange) ? attrs.sleepRange : [attrs.sleepRange];
                    if (!sleepRange.includes(filters.sleepHours)) return false;
                }

                if (filters.wellnessGoal) {
                    const wellness = attrs.wellness ? (Array.isArray(attrs.wellness) ? attrs.wellness : [attrs.wellness]) : [];
                    const benefits = attrs.benefits ? (Array.isArray(attrs.benefits) ? attrs.benefits : [attrs.benefits]) : [];
                    if (!wellness.includes(filters.wellnessGoal) && !benefits.includes(filters.wellnessGoal)) return false;
                }

                return true;
            });
        },
        [filters]
    );

    React.useEffect(() => {
        setLoading(true);
        if (search) {
            // Search mode
            productService
                .search({ q: search, brand: brandSearch, page, pageSize })
                .then((res) => {
                    let filteredProducts = applyFilters(res.items);
                    // Apply sorting
                    switch (sortBy) {
                        case "price":
                            filteredProducts.sort((a, b) => a.price - b.price);
                            break;
                        case "latest":
                            filteredProducts.sort((a, b) => (b.id > a.id ? 1 : -1));
                            break;
                        case "top-sales":
                            // Mock sorting by price (in real app, would use sales data)
                            filteredProducts.sort((a, b) => b.price - a.price);
                            break;
                        default:
                            // relevance - keep original order
                            break;
                    }
                    setProducts(filteredProducts);
                    setTotal(filteredProducts.length);
                })
                .finally(() => setLoading(false));
        } else {
            // Suggest mode - show random products
            const filtered = applyFilters(allProducts);
            const shuffled = [...filtered].sort(() => Math.random() - 0.5);
            setProducts(shuffled.slice(0, 6));
            setTotal(shuffled.length);
            setLoading(false);
        }
    }, [search, brandSearch, page, pageSize, sortBy, filters, allProducts, applyFilters]);

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

    // Get active filters for display
    const activeFilters = React.useMemo(() => {
        const active: Array<{ key: keyof HealthInput; label: string; value: string }> = [];
        if (filters.skinType) {
            active.push({ key: "skinType", label: "Skin Type", value: filters.skinType });
        }
        if (filters.stressLevel) {
            active.push({ key: "stressLevel", label: "Stress Level", value: filters.stressLevel });
        }
        if (filters.dietHabit) {
            active.push({ key: "dietHabit", label: "Diet Habit", value: filters.dietHabit.replace("_", " ") });
        }
        if (filters.sleepHours) {
            const sleepLabels: Record<string, string> = {
                "1-4": "1 - 4 hours",
                "4-6": "4 - 6 hours",
                "6-8": "6 - 8 hours",
                "8+": "More than 8 hours",
            };
            active.push({ key: "sleepHours", label: "Sleep Hours", value: sleepLabels[filters.sleepHours] || filters.sleepHours });
        }
        if (filters.wellnessGoal) {
            active.push({ key: "wellnessGoal", label: "Wellness Goal", value: filters.wellnessGoal });
        }
        return active;
    }, [filters]);

    // Remove a specific filter
    const removeFilter = (key: keyof HealthInput) => {
        setFilters({ ...filters, [key]: undefined });
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            skinType: undefined,
            stressLevel: undefined,
            dietHabit: undefined,
            sleepHours: undefined,
            wellnessGoal: undefined,
        });
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
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="ml-3 flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            placeholder="Search products..."
                        />
                    </div>
                    <div className="relative" ref={setFilterRef}>
                        <button
                            type="button"
                            onClick={() => setShowFilter(!showFilter)}
                            className={`rounded-full border p-2.5 transition ${
                                showFilter ? "border-teal-600 bg-teal-600 text-white" : "border-teal-600 bg-teal-600 text-white hover:bg-teal-700"
                            }`}
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

                        {/* Filter Dropdown */}
                        {showFilter && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
                                <div className="mb-3 text-sm font-semibold text-gray-900">Filter Products</div>
                                <div className="space-y-4">
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-semibold text-gray-700">Skin Type</span>
                                        <select
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                            value={filters.skinType || ""}
                                            onChange={(e) => setFilters({ ...filters, skinType: e.target.value || undefined })}
                                        >
                                            <option value="">All</option>
                                            {["oily", "dry", "combination", "sensitive", "normal", "dull"].map((v) => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-semibold text-gray-700">Stress Level</span>
                                        <select
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                            value={filters.stressLevel || ""}
                                            onChange={(e) => setFilters({ ...filters, stressLevel: e.target.value || undefined })}
                                        >
                                            <option value="">All</option>
                                            {["low", "medium", "high"].map((v) => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-semibold text-gray-700">Diet Habit</span>
                                        <select
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                            value={filters.dietHabit || ""}
                                            onChange={(e) => setFilters({ ...filters, dietHabit: e.target.value || undefined })}
                                        >
                                            <option value="">All</option>
                                            {["healthy", "balanced", "high_protein", "high_carb", "skip_meals"].map((v) => (
                                                <option key={v} value={v}>
                                                    {v.replace("_", " ")}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-semibold text-gray-700">Sleep Hours</span>
                                        <select
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                            value={filters.sleepHours || ""}
                                            onChange={(e) =>
                                                setFilters({ ...filters, sleepHours: (e.target.value || undefined) as HealthInput["sleepHours"] })
                                            }
                                        >
                                            <option value="">All</option>
                                            {[
                                                { key: "1-4", label: "1 - 4 hours" },
                                                { key: "4-6", label: "4 - 6 hours" },
                                                { key: "6-8", label: "6 - 8 hours" },
                                                { key: "8+", label: "More than 8 hours" },
                                            ].map((opt) => (
                                                <option key={opt.key} value={opt.key}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-semibold text-gray-700">Wellness Goal</span>
                                        <select
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                            value={filters.wellnessGoal || ""}
                                            onChange={(e) => setFilters({ ...filters, wellnessGoal: e.target.value || undefined })}
                                        >
                                            <option value="">All</option>
                                            {["relax", "energy", "glow", "weight", "focus"].map((v) => (
                                                <option key={v} value={v}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                {/* Active Filters Display */}
                {activeFilters.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600">Active filters:</span>
                        {activeFilters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => removeFilter(filter.key)}
                                className="group inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition hover:border-teal-300 hover:bg-teal-100"
                            >
                                <span>
                                    {filter.label}: <span className="font-semibold">{filter.value}</span>
                                </span>
                                <svg
                                    className="h-3.5 w-3.5 text-teal-600 transition group-hover:text-teal-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        ))}
                        <button
                            onClick={clearAllFilters}
                            className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Sort Options - show when searching or filtering */}
            {(search || activeFilters.length > 0) && (
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
            )}

            {/* Suggest Searching - only show when no search and no filters */}
            {!search && activeFilters.length === 0 && !loading && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900">Suggest Searching</h2>
                    {products.length > 0 ? (
                        <ProductList products={products} onAdd={handleAdd} />
                    ) : (
                        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-sm text-gray-600">
                            Start searching to see products
                        </div>
                    )}
                </div>
            )}

            {/* Products List - show when searching or filtering */}
            {(search || activeFilters.length > 0) && (
                <>
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
                </>
            )}

            {/* Pagination - show when searching or filtering */}
            {(search || activeFilters.length > 0) && !loading && totalPages > 1 && (
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
