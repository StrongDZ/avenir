import { withClient } from "../../common/connections/Postgres";
import { CartItem } from "../entities/Cart";

export class CartRepository {
    public async getCart(userId: string): Promise<CartItem[]> {
        return withClient(async (client) => {
            const r = await client.query(`select user_id, product_id, quantity from cart_items where user_id = $1 order by product_id asc`, [userId]);
            return r.rows.map((row: any) => ({ userId: row.user_id, productId: row.product_id, quantity: row.quantity }));
        });
    }

    public async addItem(userId: string, productId: string, quantity: number): Promise<void> {
        await withClient(async (client) => {
            await client.query(`insert into users (id) values ($1) on conflict (id) do nothing`, [userId]);
            await client.query(`insert into carts (user_id) values ($1) on conflict (user_id) do nothing`, [userId]);
            await client.query(
                `insert into cart_items (user_id, product_id, quantity) values ($1, $2, $3)
                 on conflict (user_id, product_id) do update set quantity = cart_items.quantity + excluded.quantity`,
                [userId, productId, quantity]
            );
        });
    }

    public async updateQuantity(userId: string, productId: string, quantity: number): Promise<void> {
        if (quantity <= 0) {
            await this.removeItem(userId, productId);
            return;
        }
        await withClient(async (client) => {
            await client.query(`update cart_items set quantity = $3 where user_id = $1 and product_id = $2`, [userId, productId, quantity]);
        });
    }

    public async removeItem(userId: string, productId: string): Promise<void> {
        await withClient(async (client) => {
            await client.query(`delete from cart_items where user_id = $1 and product_id = $2`, [userId, productId]);
        });
    }

    public async clear(userId: string): Promise<void> {
        await withClient(async (client) => {
            await client.query(`delete from cart_items where user_id = $1`, [userId]);
        });
    }
}
