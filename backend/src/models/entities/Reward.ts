export interface RewardTransaction {
    id: string;
    userId: string;
    type: "earn" | "redeem";
    points: number;
    created_at: string;
    meta: Record<string, any>;
}
