import { Router } from "express";
import { CheckoutController } from "../controllers/CheckoutController";

export class CheckoutRouter {
    public router: Router;
    private controller: CheckoutController;

    constructor() {
        this.router = Router();
        this.controller = new CheckoutController();
        this.routes();
    }

    private routes() {
        this.router.post("/", this.controller.post);
    }
}
