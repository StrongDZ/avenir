import { withClient } from "../../common/connections/Postgres";
import { RewardTransaction } from "../entities/Reward";

export class RewardRepository {
    public async addTransaction(userId: string, type: "earn" | "redeem", points: number, meta: any): Promise<void> {
        await withClient(async (client) => {
            await client.query(`insert into reward_transactions (user_id, type, points, meta) values ($1, $2, $3, $4)`, [
                userId,
                type,
                points,
                JSON.stringify(meta ?? {}),
            ]);
        });
    }

    public async getBalance(userId: string): Promise<number> {
        return withClient(async (client) => {
            const r = await client.query(
                `select coalesce(sum(case when type = 'earn' then points when type = 'redeem' then -points end), 0) as balance from reward_transactions where user_id = $1`,
                [userId]
            );
            return Number(r.rows[0].balance) || 0;
        });
    }

    public async getTransactions(userId: string): Promise<RewardTransaction[]> {
        return withClient(async (client) => {
            const r = await client.query(
                `select id, user_id, type, points, created_at, meta from reward_transactions where user_id = $1 order by created_at desc limit 100`,
                [userId]
            );
            return r.rows.map((row: any) => ({
                id: row.id,
                userId: row.user_id,
                type: row.type,
                points: row.points,
                created_at: row.created_at,
                meta: row.meta ?? {},
            }));
        });
    }
}
