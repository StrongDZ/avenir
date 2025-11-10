import { withClient } from "../../common/connections/Postgres";
import { User } from "../entities/User";
import { randomUUID } from "crypto";

export class UserRepository {
    public async findByUsername(username: string): Promise<User | null> {
        return withClient(async (client) => {
            const r = await client.query(`select id, username, created_at from users where username = $1 limit 1`, [username]);
            if (r.rows.length === 0) return null;
            return { id: r.rows[0].id, username: r.rows[0].username, createdAt: r.rows[0].created_at };
        });
    }

    public async findById(id: string): Promise<User | null> {
        return withClient(async (client) => {
            const r = await client.query(`select id, username, created_at from users where id = $1 limit 1`, [id]);
            if (r.rows.length === 0) return null;
            return { id: r.rows[0].id, username: r.rows[0].username, createdAt: r.rows[0].created_at };
        });
    }

    public async getPasswordHash(username: string): Promise<string | null> {
        return withClient(async (client) => {
            const r = await client.query(`select password_hash from users where username = $1 limit 1`, [username]);
            return r.rows[0]?.password_hash ?? null;
        });
    }

    public async createWithPassword(username: string, passwordHash: string): Promise<User> {
        const id = randomUUID();
        return withClient(async (client) => {
            const r = await client.query(
                `insert into users (id, username, password_hash) values ($1, $2, $3)
                 on conflict (username) do nothing
                 returning id, username, created_at`,
                [id, username, passwordHash]
            );
            if (r.rows.length === 0) {
                const existing = await this.findByUsername(username);
                if (!existing) throw new Error("Failed to create user");
                return existing;
            }
            return { id: r.rows[0].id, username: r.rows[0].username, createdAt: r.rows[0].created_at };
        });
    }
}
