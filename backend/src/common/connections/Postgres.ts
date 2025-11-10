import { Pool } from "pg";
import { PostgresConfig } from "../config";
import getLogger from "../../utils/LoggerUtils";

const logger = getLogger("Postgres");

export class PostgresClient {
    private static pool: Pool | null = null;

    public static getPool(): Pool {
        if (!PostgresClient.pool) {
            PostgresClient.pool = new Pool({
                host: PostgresConfig.HOST,
                port: PostgresConfig.PORT,
                user: PostgresConfig.USER,
                password: PostgresConfig.PASSWORD,
                database: PostgresConfig.DATABASE,
                ssl: PostgresConfig.SSL ? { rejectUnauthorized: false } : undefined,
                max: 10,
                idleTimeoutMillis: 30000,
            });

            PostgresClient.pool.on("error", (err) => {
                logger.error(`PG Pool error: ${err.message}`);
            });
        }
        return PostgresClient.pool;
    }
}

export async function withClient<T>(fn: (client: any) => Promise<T>): Promise<T> {
    const pool = PostgresClient.getPool();
    const client = await pool.connect();
    try {
        return await fn(client);
    } finally {
        client.release();
    }
}
