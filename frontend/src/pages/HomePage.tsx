import React from "react";
import { Link } from "react-router-dom";

const brands = [
    { id: "cocoon", name: "Cocoon", tone: "from-amber-300/30 via-amber-200/10 to-transparent" },
    { id: "la-spa", name: "Lá Spa", tone: "from-emerald-300/30 via-emerald-200/10 to-transparent" },
    { id: "phe-la", name: "Phê La", tone: "from-rose-300/20 via-rose-200/10 to-transparent" },
    { id: "snap-food", name: "Snap Food", tone: "from-indigo-300/30 via-indigo-200/10 to-transparent" },
];

const pillars = [
    { title: "Seamless", body: "Browse spa, skincare, nutrition and boutique coffee in just a few taps." },
    { title: "Personal", body: "Share your lifestyle goals and Avenir curates smart bundles across brands." },
    { title: "Rewarding", body: "Earn coins every time you mix and match; redeem perks instantly." },
];

const journey = [
    {
        step: "01",
        title: "Tell us your vibe",
        body: "Select wellness goals or connect wearable data so Avenir understands your day-to-day rhythm.",
    },
    {
        step: "02",
        title: "Get tailored bundles",
        body: "Receive dynamic suggestions blending skincare, nutricare and specialty drinks that complement each other.",
    },
    {
        step: "03",
        title: "Check out once",
        body: "Add multi-brand items to a single cart, earn rewards and track orders in one streamlined dashboard.",
    },
];

export const HomePage: React.FC = () => {
    return (
        <div className="space-y-16">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-600/20 via-blue-900/10 to-purple-900/30 p-10 text-white shadow-2xl shadow-blue-950/40">
                <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
                <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="relative max-w-3xl space-y-6">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-blue-100">
                        Avenir Collective
                    </span>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        One cart for every self-care ritual you love — curated intelligently for your lifestyle.
                    </h1>
                    <p className="max-w-2xl text-base text-blue-100/80 sm:text-lg">
                        Instantly blend Vietnamese wellness brands, specialty coffee, plant-based meals and spa experiences. Avenir learns from your
                        habits to keep every routine joyful, balanced and rewarding.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/recommend"
                            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-blue-900/30 transition hover:scale-[1.02]"
                        >
                            Build my smart bundle
                        </Link>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                        >
                            Explore the marketplace
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-xl sm:grid-cols-3">
                {pillars.map((pillar) => (
                    <div
                        key={pillar.title}
                        className="space-y-3 rounded-2xl border border-white/5 bg-slate-900/40 p-6 shadow-inner shadow-blue-900/20"
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300/80">Why Avenir</div>
                        <div className="text-lg font-semibold text-white">{pillar.title}</div>
                        <p className="text-sm text-slate-200/80">{pillar.body}</p>
                    </div>
                ))}
            </section>

            <section className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold text-white">Trusted boutique partners</h2>
                    <Link to="/products" className="text-sm font-semibold text-blue-300 hover:text-white">
                        Browse all brands →
                    </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {brands.map((brand) => (
                        <Link
                            key={brand.id}
                            to={`/products?brand=${brand.id}`}
                            className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${brand.tone} p-6 text-white transition hover:border-white/20 hover:shadow-lg hover:shadow-blue-900/20`}
                        >
                            <div className="text-xs uppercase tracking-[0.35em] text-white/70">Brand</div>
                            <div className="mt-3 text-xl font-semibold">{brand.name}</div>
                            <div className="mt-6 text-xs text-white/70">Tap to explore curated picks</div>
                            <div className="absolute -right-6 bottom-2 h-16 w-16 rotate-12 rounded-full bg-white/10 blur-lg transition group-hover:rotate-0" />
                        </Link>
                    ))}
                </div>
            </section>

            <section className="rounded-3xl border border-white/5 bg-slate-950/80 p-8 shadow-2xl shadow-blue-950/40">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-xl space-y-5">
                        <h2 className="text-3xl font-semibold text-white">Your wellness journey, orchestrated in three steps</h2>
                        <p className="text-sm text-slate-300/80">
                            Mix bio-data, expert heuristics and local brand knowledge to craft experiences that feel personal every single day.
                        </p>
                    </div>
                    <div className="grid w-full gap-4 sm:grid-cols-3">
                        {journey.map((item) => (
                            <div key={item.step} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-blue-950/30">
                                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-300/70">{item.step}</div>
                                <div className="mt-2 text-base font-semibold text-white">{item.title}</div>
                                <p className="mt-3 text-xs text-slate-300/70">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
