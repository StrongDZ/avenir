import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { Product } from "../types/product";
import { ProductList } from "../components/products/ProductList";
import { useCartContext } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";
import { Loader } from "../components/common/Loader";

const pageSize = 9;

export const ProductsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
    const brandParam = query.get("brand") || "";

    const { add } = useCartContext();
    const { notify } = useNotification();

    const [search, setSearch] = React.useState(query.get("q") || "");
    const [brandSearch, setBrandSearch] = React.useState(brandParam);
    const [page, setPage] = React.useState(Number(query.get("page")) || 1);
    const [loading, setLoading] = React.useState(true);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [total, setTotal] = React.useState(0);
    const [allBrands, setAllBrands] = React.useState<Array<{ id: string; name: string }>>([]);
    const [brandsLoading, setBrandsLoading] = React.useState(true);

    React.useEffect(() => {
        productService
            .getBrands()
            .then(setAllBrands)
            .finally(() => setBrandsLoading(false));
    }, []);

    React.useEffect(() => {
        const qValue = query.get("q") || "";
        if (qValue !== search) setSearch(qValue);
        const brandValue = query.get("brand") || "";
        if (brandValue !== brandSearch) setBrandSearch(brandValue);
        const pageValue = Number(query.get("page") || "1");
        if (!Number.isNaN(pageValue) && pageValue !== page) {
            setPage(Math.max(1, pageValue));
        }
    }, [query, search, brandSearch, page]);

    React.useEffect(() => {
        setLoading(true);
        productService
            .search({ q: search, brand: brandSearch, page, pageSize })
            .then((res) => {
                setProducts(res.items);
                setTotal(res.total);
            })
            .finally(() => setLoading(false));
    }, [search, brandSearch, page, pageSize]);

    const syncNavigate = React.useCallback(
        ({ searchValue, brandValue, pageValue }: { searchValue?: string; brandValue?: string; pageValue?: number }) => {
            const nextSearch = searchValue !== undefined ? searchValue : search;
            const nextBrand = brandValue !== undefined ? brandValue : brandSearch;
            const nextPage = pageValue !== undefined ? pageValue : page;
            const params = new URLSearchParams();
            if (nextSearch) params.set("q", nextSearch);
            if (nextBrand) params.set("brand", nextBrand);
            if (nextPage > 1) params.set("page", nextPage.toString());
            const target = params.toString();
            navigate(target ? `?${target}` : ".", { replace: false });
        },
        [navigate, search, brandSearch, page]
    );

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
        syncNavigate({ searchValue: value, pageValue: 1 });
    };

    const handleBrandSearchChange = (value: string) => {
        setBrandSearch(value);
        setPage(1);
        syncNavigate({ brandValue: value, pageValue: 1 });
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

    const stats = React.useMemo(() => {
        return {
            total,
            brands: allBrands.length,
        };
    }, [total, allBrands]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="space-y-10">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-900/60 to-blue-900/40 p-8 text-white shadow-2xl shadow-blue-950/40">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-xl space-y-4">
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Curated collections, cross-brand discovery</h1>
                        <p className="text-sm text-blue-100/80 sm:text-base">
                            Filter across boutique wellness partners. Every product is tagged to complement your routines, so you can mix and match
                            knowing it works together.
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                                <div className="text-2xl font-semibold text-white">{stats.total}</div>
                                <div className="text-blue-100/70">Total items</div>
                            </div>
                            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
                                <div className="text-2xl font-semibold text-white">{stats.brands}</div>
                                <div className="text-blue-100/70">Partner brands</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:max-w-xs">
                        <div className="rounded-2xl border border-white/20 bg-slate-950/60 px-4 py-3 shadow-inner shadow-blue-950/30">
                            <div className="text-xs uppercase tracking-[0.35em] text-blue-200/80">Live search</div>
                            <div className="mt-2 text-sm text-slate-200/80">
                                Try keywords like <span className="font-semibold text-white">“caffeine-free”</span> or{" "}
                                <span className="font-semibold text-white">“skin barrier”</span>.
                            </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs text-blue-100/70">
                            Bundles update every morning based on wellness trend data, so keep an eye on limited drops.
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur sm:flex-row sm:items-center sm:gap-4">
                    <div className="w-full sm:flex-1">
                        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 shadow-inner shadow-blue-950/20 focus-within:border-blue-400/60">
                            <span className="text-xs text-slate-400">Search</span>
                            <input
                                value={search}
                                onChange={(event) => handleSearchChange(event.target.value)}
                                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                                placeholder="Matcha, collagen, vegan lunch..."
                            />
                            {search && (
                                <button onClick={() => handleSearchChange("")} className="text-xs text-slate-400 hover:text-white">
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="w-full sm:flex-1">
                        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 shadow-inner shadow-blue-950/20 focus-within:border-blue-400/60">
                            <span className="text-xs text-slate-400">Brand</span>
                            <input
                                value={brandSearch}
                                onChange={(event) => handleBrandSearchChange(event.target.value)}
                                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                                placeholder="Search by brand name..."
                            />
                            {brandSearch && (
                                <button onClick={() => handleBrandSearchChange("")} className="text-xs text-slate-400 hover:text-white">
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-3xl border border-white/5 bg-slate-950/70 p-10 text-center">
                        <Loader text="Fetching fresh picks for you..." />
                    </div>
                ) : products.length > 0 ? (
                    <ProductList products={products} onAdd={handleAdd} />
                ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-12 text-center text-sm text-slate-300/80">
                        No products match your filters yet. Try clearing the search or exploring another partner brand.
                    </div>
                )}

                {!loading && (
                    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-200/80 sm:flex-row">
                        <div>
                            Page {page} / {totalPages} • {total} curated items
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-white/30 hover:text-white disabled:opacity-40"
                                onClick={() => goToPage(page - 1)}
                                disabled={page <= 1}
                            >
                                Prev
                            </button>
                            <button
                                className="inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-white/30 hover:text-white disabled:opacity-40"
                                onClick={() => goToPage(page + 1)}
                                disabled={page >= totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};
