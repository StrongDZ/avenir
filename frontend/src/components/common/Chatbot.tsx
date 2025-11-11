import React from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { Product } from "../../types/product";
import { formatCurrencyVnd } from "../../utils/formatCurrency";

interface Message {
    role: "user" | "assistant";
    content: string;
    products?: Product[];
}

export const Chatbot: React.FC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [products, setProducts] = React.useState<Product[]>([]);
    const toggle = () => setOpen((o) => !o);

    // Load products once
    React.useEffect(() => {
        productService
            .list()
            .then(setProducts)
            .catch(() => setProducts([]));
    }, []);

    // Simple keyword matching to recommend products
    const findMatchingProducts = (message: string): Product[] => {
        const lowerMsg = message.toLowerCase();
        const matches: { product: Product; score: number }[] = [];

        products.forEach((product) => {
            let score = 0;
            const nameLower = product.name.toLowerCase();
            const tagsLower = product.tags.map((t) => t.toLowerCase()).join(" ");
            const attributes = product.attributes || {};

            // Check name and tags
            if (nameLower.includes(lowerMsg) || tagsLower.includes(lowerMsg)) {
                score += 10;
            }

            // Check for skin type keywords
            const skinKeywords = ["oily", "dry", "sensitive", "combination", "normal", "dull", "acne", "skin"];
            if (skinKeywords.some((kw) => lowerMsg.includes(kw))) {
                const skinTypes = (attributes.skinType as string[]) || [];
                if (skinTypes.some((st) => lowerMsg.includes(st.toLowerCase()))) {
                    score += 8;
                }
            }

            // Check for wellness keywords
            if (lowerMsg.includes("stress") || lowerMsg.includes("relax")) {
                const wellness = (attributes.wellness as string[]) || [];
                if (wellness.includes("stress")) score += 7;
            }

            if (lowerMsg.includes("energy") || lowerMsg.includes("tired") || lowerMsg.includes("coffee")) {
                const symptoms = (attributes.symptom as string[]) || [];
                if (symptoms.includes("low_energy")) score += 7;
                if (product.tags.some((t) => t.toLowerCase().includes("coffee"))) score += 5;
            }

            // Check for diet/food keywords
            if (lowerMsg.includes("food") || lowerMsg.includes("meal") || lowerMsg.includes("diet") || lowerMsg.includes("healthy")) {
                if (product.brandId === "snap-food") score += 6;
            }

            // Check for spa keywords
            if (lowerMsg.includes("spa") || lowerMsg.includes("massage") || lowerMsg.includes("relax")) {
                if (product.brandId === "la-spa") score += 6;
            }

            // Check for skincare keywords
            if (lowerMsg.includes("skincare") || lowerMsg.includes("cream") || lowerMsg.includes("serum") || lowerMsg.includes("toner")) {
                if (product.brandId === "cocoon") score += 6;
            }

            // Check brand names
            if (lowerMsg.includes("cocoon")) {
                if (product.brandId === "cocoon") score += 5;
            }
            if (lowerMsg.includes("la spa") || lowerMsg.includes("lá spa")) {
                if (product.brandId === "la-spa") score += 5;
            }
            if (lowerMsg.includes("phê la") || lowerMsg.includes("phe la")) {
                if (product.brandId === "phe-la") score += 5;
            }
            if (lowerMsg.includes("snap food")) {
                if (product.brandId === "snap-food") score += 5;
            }

            if (score > 0) {
                matches.push({ product, score });
            }
        });

        // Sort by score and return top 3
        return matches
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((m) => m.product);
    };

    const send = async () => {
        if (!input.trim()) return;
        const userMsg: Message = { role: "user", content: input.trim() };
        setMessages((m) => [...m, userMsg]);
        const messageText = input.trim();
        setInput("");
        setLoading(true);

        // Simulate thinking delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        try {
            const matchedProducts = findMatchingProducts(messageText);
            let responseText = "";

            if (matchedProducts.length > 0) {
                responseText = `Based on your situation, I recommend the following products:\n\n`;
                matchedProducts.forEach((p, idx) => {
                    responseText += `${idx + 1}. ${p.name} - ${formatCurrencyVnd(p.price)}\n`;
                });
                responseText += `\nClick on the product below to view details!`;
            } else {
                responseText = `Thank you for asking. Currently, I can help you find products that are suitable for:\n\n• Skin type (oily, dry, sensitive...)\n• Wellness goals (energy, relax, glow...)\n• Brands (Cocoon, Lá Spa, Phê La, Snap Food)\n• Healthy nutrition and food\n\nPlease describe your situation in more detail so I can recommend better!`;
            }

            const assistantMsg: Message = {
                role: "assistant",
                content: responseText,
                products: matchedProducts.length > 0 ? matchedProducts : undefined,
            };
            setMessages((m) => [...m, assistantMsg]);
        } catch (e: any) {
            setMessages((m) => [...m, { role: "assistant", content: "Sorry, an error occurred. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/30 transition hover:scale-105 hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
                onClick={toggle}
            >
                <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-white/70" />
                {open ? "Close assistant" : "Need a hand?"}
            </button>
            {open && (
                <div className="fixed bottom-28 right-6 z-40 flex w-96 flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-md">
                        Avenir Assistant
                        <div className="text-[11px] font-normal text-teal-50">Ask about bundles, nutrition or rewards in seconds.</div>
                    </div>
                    <div className="flex-1 space-y-3 overflow-auto bg-gray-50 px-4 py-3" style={{ maxHeight: 480 }}>
                        {messages.map((m, idx) => (
                            <div key={idx} className={`flex flex-col gap-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
                                <div
                                    className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow whitespace-pre-wrap ${
                                        m.role === "user"
                                            ? "bg-teal-600 text-white shadow-teal-900/30"
                                            : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                                    }`}
                                >
                                    {m.content}
                                </div>
                                {m.role === "assistant" && m.products && m.products.length > 0 && (
                                    <div className="flex flex-col gap-2 w-full max-w-[90%]">
                                        {m.products.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => {
                                                    navigate(`/products/${product.id}`);
                                                    setOpen(false);
                                                }}
                                                className="group rounded-xl border border-gray-200 bg-white p-3 text-left transition hover:border-teal-400 hover:bg-teal-50 hover:shadow-md"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs uppercase tracking-[0.2em] text-teal-600 mb-1">{product.brandId}</div>
                                                        <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-teal-700 transition">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">{formatCurrencyVnd(product.price)}</div>
                                                    </div>
                                                    <div className="text-xs text-teal-600 opacity-0 group-hover:opacity-100 transition">→</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && <div className="text-xs text-teal-600">Thinking...</div>}
                    </div>
                    <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-2">
                        <input
                            className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about products..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter") send();
                            }}
                        />
                        <button
                            className="inline-flex items-center justify-center rounded-full bg-teal-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50"
                            onClick={send}
                            disabled={loading}
                        >
                            {loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
