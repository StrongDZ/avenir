import { CartRepository } from "../models/repositories/CartRepository";
import { ProductRepository } from "../models/repositories/ProductRepository";
import { OrderRepository } from "../models/repositories/OrderRepository";
import { RewardRepository } from "../models/repositories/RewardRepository";
import { calculateEarnedPoints, calculateRedeemDiscount } from "../utils/RewardUtils";

export class CheckoutService {
    private cartRepo = new CartRepository();
    private productRepo = new ProductRepository();
    private orderRepo = new OrderRepository();
    private rewardRepo = new RewardRepository();

    public async checkout(userId: string, redeemPoints: number) {
        const cart = await this.cartRepo.getCart(userId);
        if (cart.length === 0) {
            throw new Error("Cart is empty");
        }
        const products = await this.productRepo.findByIds(cart.map((i) => i.productId));
        const productMap = new Map(products.map((p) => [p.id, p] as const));
        const items = cart.map((i) => ({ productId: i.productId, quantity: i.quantity, price: productMap.get(i.productId)!.price }));
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

        const balance = await this.rewardRepo.getBalance(userId);
        const redeem = Math.max(0, Math.min(redeemPoints || 0, balance));
        const discountVnd = calculateRedeemDiscount(redeem);
        const total = Math.max(0, subtotal - discountVnd);
        const earned = calculateEarnedPoints(total);

        const order = await this.orderRepo.createOrder(userId, items, subtotal, discountVnd, total, "Paid");
        await this.cartRepo.clear(userId);

        if (redeem > 0) await this.rewardRepo.addTransaction(userId, "redeem", redeem, { orderId: order.id });
        if (earned > 0) await this.rewardRepo.addTransaction(userId, "earn", earned, { orderId: order.id });

        await this.orderRepo.updateStatus(order.id, "Processing");

        return { orderId: order.id, subtotal, discountVnd, total, earned, status: "Processing" };
    }
}
