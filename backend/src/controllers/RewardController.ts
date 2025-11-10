import { Request, Response } from "express";
import { sendRes } from "../utils/ResUtils";
import { RewardService } from "../services/RewardService";

export class RewardController {
    private rewardService = new RewardService();

    constructor() {
        this.get = this.get.bind(this);
    }

    public async get(req: Request, res: Response) {
        try {
            const userId = String(req.query.userId || req.body.userId);
            const overview = await this.rewardService.getOverview(userId);
            sendRes(res, null, overview);
        } catch (e: any) {
            sendRes(res, e);
        }
    }
}
