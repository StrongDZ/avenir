import { Router } from "express";
import { RecommendationController } from "../controllers/RecommendationController";

export class RecommendationRouter {
    public router: Router;
    private controller: RecommendationController;

    constructor() {
        this.router = Router();
        this.controller = new RecommendationController();
        this.routes();
    }

    private routes() {
        this.router.post("/", this.controller.get);
    }
}
