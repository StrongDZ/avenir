import { Product } from "../models/entities/Product";
import { ProductRepository } from "../models/repositories/ProductRepository";

export interface RecommendationInput {
    skinType?: string;
    stressLevel?: string;
    dietHabit?: string;
    sleepHours?: string;
    wellnessGoal?: string;
}

export class RecommendationService {
    private productRepo: ProductRepository;

    constructor() {
        this.productRepo = new ProductRepository();
    }

    public async getRecommendations(input: RecommendationInput): Promise<{ primary: Product[]; bundles: Record<string, Product[]> }> {
        const primary = await this.productRepo.findMatchingByAttributes(input);

        // Simple bundles: for each primary, suggest cross-brand complements
        const bundles: Record<string, Product[]> = {};
        const all = await this.productRepo.findAll();
        for (const p of primary) {
            const suggestions: Product[] = [];
            if (p.brandId === "cocoon") {
                const spa = all.find((x) => x.brandId === "la-spa");
                if (spa) suggestions.push(spa);
                const coffee = all.find((x) => x.brandId === "phe-la" && x.tags.includes("energy"));
                if (coffee) suggestions.push(coffee);
            } else if (p.brandId === "la-spa") {
                const skincare = all.find((x) => x.brandId === "cocoon");
                if (skincare) suggestions.push(skincare);
            } else if (p.brandId === "phe-la") {
                const bowl = all.find((x) => x.brandId === "snap-food");
                if (bowl) suggestions.push(bowl);
            }
            bundles[p.id] = suggestions;
        }
        return { primary, bundles };
    }
}
