import { withClient } from "../../common/connections/Postgres";

interface CreateReviewParams {
    orderId: string;
    userId: string;
    rating: number;
    comment?: string;
}

export class OrderReviewRepository {
    public async createReview(params: CreateReviewParams): Promise<{ id: string; createdAt: string }> {
        const { orderId, userId, rating, comment } = params;
        return withClient(async (client) => {
            const res = await client.query(
                `insert into order_reviews (order_id, user_id, rating, comment) values ($1, $2, $3, $4) returning id, created_at`,
                [orderId, userId, rating, comment ?? null]
            );
            return { id: res.rows[0].id, createdAt: res.rows[0].created_at };
        });
    }

    public async hasReview(orderId: string): Promise<boolean> {
        return withClient(async (client) => {
            const res = await client.query(`select 1 from order_reviews where order_id = $1 limit 1`, [orderId]);
            return res.rows.length > 0;
        });
    }
}
