export interface RewardTransaction {
    id: string;
    type: "earn" | "redeem";
    points: number;
    created_at: string;
    meta: Record<string, unknown>;
}

export interface RewardOverview {
    balance: number;
    transactions: RewardTransaction[];
}
