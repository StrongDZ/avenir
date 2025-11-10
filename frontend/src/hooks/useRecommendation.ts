import React from "react";
import { recommendationService } from "../services/recommendationService";
import { HealthInput, RecommendationResult } from "../types/recommendation";

export function useRecommendation() {
    const [data, setData] = React.useState<RecommendationResult | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchRecommendations = async (input: HealthInput) => {
        setLoading(true);
        setError(null);
        try {
            const result = await recommendationService.get(input);
            setData(result);
        } catch (e: any) {
            setError(e?.message || String(e));
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fetchRecommendations };
}
