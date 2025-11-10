import { Router } from "express";
import { CartController } from "../controllers/CartController";

export class CartRouter {
    public router: Router;
    private controller: CartController;

    constructor() {
        this.router = Router();
        this.controller = new CartController();
        this.routes();
    }

    private routes() {
        this.router.get("/", this.controller.get);
        this.router.post("/add", this.controller.add);
        this.router.post("/update", this.controller.updateQuantity);
        this.router.post("/remove", this.controller.remove);
    }
}
