import { apiClient } from "./apiClient";
import { HealthInput, RecommendationResult } from "../types/recommendation";

export const recommendationService = {
    get(input: HealthInput): Promise<RecommendationResult> {
        return apiClient.post<RecommendationResult>("/recommendations", input);
    },
};
