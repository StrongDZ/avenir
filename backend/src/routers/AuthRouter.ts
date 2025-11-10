import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export class AuthRouter {
    public router: Router;
    private controller: AuthController;

    constructor() {
        this.router = Router();
        this.controller = new AuthController();
        this.routes();
    }

    private routes() {
        this.router.post("/register", this.controller.register);
        this.router.post("/login", this.controller.login);
        this.router.get("/me", this.controller.me);
    }
}
