import { RewardRepository } from "../models/repositories/RewardRepository";

export class RewardService {
    private rewardRepo = new RewardRepository();

    public async getOverview(userId: string) {
        const [balance, transactions] = await Promise.all([this.rewardRepo.getBalance(userId), this.rewardRepo.getTransactions(userId)]);
        return { balance, transactions };
    }
}
