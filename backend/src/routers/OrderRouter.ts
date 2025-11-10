import { Router } from "express";
import { OrderController } from "../controllers/OrderController";

export class OrderRouter {
    public router: Router;
    private controller: OrderController;

    constructor() {
        this.router = Router();
        this.controller = new OrderController();
        this.routes();
    }

    private routes() {
        this.router.get("/", this.controller.getMyOrders);
        this.router.post("/:orderId/ship", this.controller.markShipped);
        this.router.post("/:orderId/receive", this.controller.confirmReceived);
        this.router.post("/:orderId/review", this.controller.leaveReview);
    }
}
