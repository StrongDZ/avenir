import { Request, Response } from "express";
import { sendRes } from "../utils/ResUtils";
import { RecommendationService } from "../services/RecommendationService";

export class RecommendationController {
    private recService = new RecommendationService();

    constructor() {
        this.get = this.get.bind(this);
    }

    public async get(req: Request, res: Response) {
        try {
            const result = await this.recService.getRecommendations(req.body || {});
            sendRes(res, null, result);
        } catch (e: any) {
            sendRes(res, e);
        }
    }
}
