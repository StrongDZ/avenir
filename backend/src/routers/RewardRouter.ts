import { Router } from "express";
import { RewardController } from "../controllers/RewardController";

export class RewardRouter {
    public router: Router;
    private controller: RewardController;

    constructor() {
        this.router = Router();
        this.controller = new RewardController();
        this.routes();
    }

    private routes() {
        this.router.get("/", this.controller.get);
    }
}
