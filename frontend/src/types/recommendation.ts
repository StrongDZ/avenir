import { Product } from "./product";

export interface HealthInput {
    skinType?: string;
    stressLevel?: string;
    dietHabit?: string;
    sleepHours?: "1-4" | "4-6" | "6-8" | "8+";
    wellnessGoal?: string;
}

export interface RecommendationResult {
    primary: Product[];
    bundles: Record<string, Product[]>;
}
