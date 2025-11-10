import { CartRepository } from "../models/repositories/CartRepository";
import { ProductRepository } from "../models/repositories/ProductRepository";

export class CartService {
    private cartRepo: CartRepository;
    private productRepo: ProductRepository;

    constructor() {
        this.cartRepo = new CartRepository();
        this.productRepo = new ProductRepository();
    }

    public async getCart(userId: string) {
        const items = await this.cartRepo.getCart(userId);
        const products = await this.productRepo.findByIds(items.map((i) => i.productId));
        const productMap = new Map(products.map((p) => [p.id, p] as const));
        return items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            product: productMap.get(i.productId),
        }));
    }

    public async add(userId: string, productId: string, quantity: number) {
        await this.cartRepo.addItem(userId, productId, quantity);
    }

    public async updateQuantity(userId: string, productId: string, quantity: number) {
        await this.cartRepo.updateQuantity(userId, productId, quantity);
    }

    public async remove(userId: string, productId: string) {
        await this.cartRepo.removeItem(userId, productId);
    }

    public async clear(userId: string) {
        await this.cartRepo.clear(userId);
    }
}
