import { Request, Response } from "express";
import { sendRes } from "../utils/ResUtils";
import { ProductService } from "../services/ProductService";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

export class ChatController {
    private productService = new ProductService();

    constructor() {
        this.chat = this.chat.bind(this);
    }

    public async chat(req: Request, res: Response) {
        try {
            const { message, userProfile } = req.body || {};
            if (!message || typeof message !== "string") throw new Error("message is required");
            const products = await this.productService.listProducts();
            let reply = "";
            if (!OPENAI_API_KEY) {
                // Fallback basic suggestion without OpenAI
                const top = products
                    .slice(0, 3)
                    .map((p) => `${p.name} (${p.price} VND)`)
                    .join(", ");
                reply = `I cannot access OpenAI right now. Here are some popular products: ${top}`;
            } else {
                const prompt = [
                    "You are a helpful shopping assistant for a wellness marketplace.",
                    "Use the provided product catalog to recommend suitable products.",
                    userProfile ? `User profile: ${JSON.stringify(userProfile)}` : "",
                    `User message: ${message}`,
                    `Catalog: ${products.map((p) => `- ${p.name} [${p.id}] price=${p.price} tags=${(p.tags || []).join(",")}`).join("\n")}`,
                    "Answer concisely with concrete product names and reasons.",
                ]
                    .filter(Boolean)
                    .join("\n");
                const resp = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${OPENAI_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: "You are a helpful assistant." },
                            { role: "user", content: prompt },
                        ],
                        temperature: 0.4,
                    }),
                } as any);
                if (!resp.ok) throw new Error(`OpenAI error: ${resp.status}`);
                const data = (await resp.json()) as any;
                reply = data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";
            }
            sendRes(res, null, { reply });
        } catch (e: any) {
            sendRes(res, e);
        }
    }
}
