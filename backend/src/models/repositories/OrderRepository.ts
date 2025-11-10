import { withClient } from "../../common/connections/Postgres";
import { Order, OrderItem } from "../entities/Order";

export class OrderRepository {
    public async createOrder(
        userId: string,
        items: OrderItem[],
        subtotal: number,
        discountVnd: number,
        total: number,
        status: string
    ): Promise<Order> {
        return withClient(async (client) => {
            await client.query("begin");
            try {
                const res = await client.query(
                    `insert into orders (user_id, subtotal, discount_vnd, total, status) values ($1, $2, $3, $4, $5) returning *`,
                    [userId, subtotal, discountVnd, total, status]
                );
                const orderId = res.rows[0].id as string;
                for (const it of items) {
                    await client.query(`insert into order_items (order_id, product_id, quantity, price) values ($1, $2, $3, $4)`, [
                        orderId,
                        it.productId,
                        it.quantity,
                        it.price,
                    ]);
                }
                await client.query("commit");
                return this.mapOrder(res.rows[0], items);
            } catch (e) {
                await client.query("rollback");
                throw e;
            }
        });
    }

    public async findById(orderId: string): Promise<Order | null> {
        return withClient(async (client) => {
            const orderRes = await client.query(`select * from orders where id = $1 limit 1`, [orderId]);
            if (orderRes.rows.length === 0) return null;
            const itemsRes = await client.query(`select product_id, quantity, price from order_items where order_id = $1`, [orderId]);
            const items: OrderItem[] = itemsRes.rows.map((r: any) => ({
                productId: r.product_id,
                quantity: r.quantity,
                price: r.price,
            }));
            return this.mapOrder(orderRes.rows[0], items);
        });
    }

    public async updateStatus(
        orderId: string,
        status: string,
        timestamps?: { shippedAt?: boolean; deliveredAt?: boolean; closedAt?: boolean }
    ): Promise<void> {
        return withClient(async (client) => {
            const updates: string[] = ["status = $2"];
            const values: any[] = [orderId, status];
            if (timestamps?.shippedAt) {
                updates.push("shipped_at = now()");
            }
            if (timestamps?.deliveredAt) {
                updates.push("delivered_at = now()");
            }
            if (timestamps?.closedAt) {
                updates.push("closed_at = now()");
            }
            await client.query(`update orders set ${updates.join(", ")} where id = $1`, values);
        });
    }

    public async findByUserPaged(
        userId: string,
        page: number,
        pageSize: number
    ): Promise<{
        items: Order[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        const offset = (page - 1) * pageSize;
        return withClient(async (client) => {
            const countRes = await client.query(`select count(*)::int as count from orders where user_id = $1`, [userId]);
            const total = countRes.rows[0]?.count ?? 0;
            const ordersRes = await client.query(
                `select id, user_id, subtotal, discount_vnd, total, status, shipped_at, delivered_at, closed_at, created_at
                 from orders
                 where user_id = $1
                 order by created_at desc
                 limit $2 offset $3`,
                [userId, pageSize, offset]
            );
            const orders: Order[] = [];
            for (const row of ordersRes.rows) {
                const itemsRes = await client.query(`select product_id, quantity, price from order_items where order_id = $1`, [row.id]);
                const items: OrderItem[] = itemsRes.rows.map((r: any) => ({
                    productId: r.product_id,
                    quantity: r.quantity,
                    price: r.price,
                }));
                orders.push(this.mapOrder(row, items));
            }
            return { items: orders, total, page, pageSize };
        });
    }

    private mapOrder(row: any, items: OrderItem[]): Order {
        return {
            id: row.id,
            userId: row.user_id,
            subtotal: row.subtotal,
            discountVnd: row.discount_vnd,
            total: row.total,
            status: row.status,
            createdAt: row.created_at,
            shippedAt: row.shipped_at ?? null,
            deliveredAt: row.delivered_at ?? null,
            closedAt: row.closed_at ?? null,
            items,
        };
    }
}
