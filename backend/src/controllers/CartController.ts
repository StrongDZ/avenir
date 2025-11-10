import { Request, Response } from "express";
import { sendRes } from "../utils/ResUtils";
import { CartService } from "../services/CartService";

export class CartController {
    private cartService = new CartService();

    constructor() {
        this.get = this.get.bind(this);
        this.add = this.add.bind(this);
        this.updateQuantity = this.updateQuantity.bind(this);
        this.remove = this.remove.bind(this);
    }

    public async get(req: Request, res: Response) {
        try {
            const userId = String(req.query.userId || req.body.userId);
            const items = await this.cartService.getCart(userId);
            sendRes(res, null, { items });
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async add(req: Request, res: Response) {
        try {
            const { userId, productId, quantity } = req.body;
            await this.cartService.add(userId, productId, Number(quantity || 1));
            sendRes(res, null, { ok: true });
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async updateQuantity(req: Request, res: Response) {
        try {
            const { userId, productId, quantity } = req.body;
            await this.cartService.updateQuantity(userId, productId, Number(quantity || 1));
            sendRes(res, null, { ok: true });
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async remove(req: Request, res: Response) {
        try {
            const { userId, productId } = req.body;
            await this.cartService.remove(userId, productId);
            sendRes(res, null, { ok: true });
        } catch (e: any) {
            sendRes(res, e);
        }
    }
}
