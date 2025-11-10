import { Request, Response } from "express";
import { sendRes } from "../utils/ResUtils";
import { OrderRepository } from "../models/repositories/OrderRepository";
import { OrderReviewRepository } from "../models/repositories/OrderReviewRepository";
import { RewardRepository } from "../models/repositories/RewardRepository";
import { reviewRewardPoints } from "../utils/RewardUtils";

export class OrderController {
    private orderRepo = new OrderRepository();
    private reviewRepo = new OrderReviewRepository();
    private rewardRepo = new RewardRepository();

    constructor() {
        this.getMyOrders = this.getMyOrders.bind(this);
        this.markShipped = this.markShipped.bind(this);
        this.confirmReceived = this.confirmReceived.bind(this);
        this.leaveReview = this.leaveReview.bind(this);
    }

    public async getMyOrders(req: Request, res: Response) {
        try {
            const userId = String(req.query.userId ?? "");
            if (!userId) throw new Error("userId is required");
            const page = Math.max(1, Number(req.query.page ?? 1));
            const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize ?? 10)));
            const result = await this.orderRepo.findByUserPaged(userId, page, pageSize);
            sendRes(res, null, result);
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async markShipped(req: Request, res: Response) {
        try {
            const orderId = req.params.orderId;
            if (!orderId) throw new Error("orderId is required");
            await this.orderRepo.updateStatus(orderId, "Shipped", { shippedAt: true });
            sendRes(res, null, { orderId, status: "Shipped" });
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async confirmReceived(req: Request, res: Response) {
        try {
            const orderId = req.params.orderId;
            const { userId } = req.body || {};
            if (!orderId) throw new Error("orderId is required");
            if (!userId) throw new Error("userId is required");
            const order = await this.orderRepo.findById(orderId);
            if (!order) throw new Error("Order not found");
            if (order.userId !== userId) throw new Error("Forbidden");
            await this.orderRepo.updateStatus(orderId, "Delivered", { deliveredAt: true });
            sendRes(res, null, { orderId, status: "Delivered" });
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async leaveReview(req: Request, res: Response) {
        try {
            const orderId = req.params.orderId;
            const { userId, rating, comment } = req.body || {};
            if (!orderId) throw new Error("orderId is required");
            if (!userId) throw new Error("userId is required");
            const numericRating = Number(rating);
            if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
                throw new Error("rating must be between 1 and 5");
            }
            const order = await this.orderRepo.findById(orderId);
            if (!order) throw new Error("Order not found");
            if (order.userId !== userId) throw new Error("Forbidden");
            if (order.status !== "Delivered" && order.status !== "Shipped") {
                throw new Error("Order must be delivered before leaving a review");
            }
            const alreadyReviewed = await this.reviewRepo.hasReview(orderId);
            if (alreadyReviewed) throw new Error("Order already reviewed");
            const review = await this.reviewRepo.createReview({ orderId, userId, rating: numericRating, comment });
            const points = reviewRewardPoints();
            if (points > 0) {
                await this.rewardRepo.addTransaction(userId, "earn", points, { orderId, reviewId: review.id, rating: numericRating });
            }
            await this.orderRepo.updateStatus(orderId, "Closed", { closedAt: true });
            sendRes(res, null, { orderId, reviewId: review.id, pointsAwarded: points, status: "Closed" });
        } catch (e: any) {
            sendRes(res, e);
        }
    }
}
