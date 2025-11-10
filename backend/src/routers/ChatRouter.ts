import { Router } from "express";
import { ChatController } from "../controllers/ChatController";

export class ChatRouter {
    public router: Router;
    private controller: ChatController;

    constructor() {
        this.router = Router();
        this.controller = new ChatController();
        this.routes();
    }

    private routes() {
        this.router.post("/", this.controller.chat);
    }
}
