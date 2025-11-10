import { Request, Response } from "express";
import { sendRes } from "../utils/ResUtils";
import { CheckoutService } from "../services/CheckoutService";

export class CheckoutController {
    private checkoutService = new CheckoutService();

    constructor() {
        this.post = this.post.bind(this);
    }

    public async post(req: Request, res: Response) {
        try {
            const { userId, redeemPoints } = req.body;
            if (!userId) throw new Error("userId is required");
            const result = await this.checkoutService.checkout(userId, Number(redeemPoints || 0));
            sendRes(res, null, result);
        } catch (e: any) {
            sendRes(res, e);
        }
    }
}
