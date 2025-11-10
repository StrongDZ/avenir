import { RewardConfig } from "../common/config";

export function calculateEarnedPoints(totalVnd: number): number {
    const rate = Math.max(1, Math.round(RewardConfig.REDEEM_RATE_VND_PER_POINT || 10000));
    const rewardValue = totalVnd * 0.1; // 10% of order value
    return Math.floor(rewardValue / rate);
}

export function calculateRedeemDiscount(points: number): number {
    const rate = Math.max(1, Math.round(RewardConfig.REDEEM_RATE_VND_PER_POINT || 10000));
    return points * rate;
}

export function reviewRewardPoints(): number {
    return Math.max(0, Math.round(RewardConfig.REVIEW_POINTS ?? 0));
}
