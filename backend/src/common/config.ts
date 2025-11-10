import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

export const PROJECT_DIR = path.resolve(__dirname, "..", "..");
export const SECRETS_DIR = path.join(PROJECT_DIR, "secrets");

export const Config = {
    IS_PRODUCTION: process.env.IS_PRODUCTION === "true",
    HOST: process.env.HOST ?? "localhost",
    PORT: process.env.PORT ?? 8000,
    API_SCHEMES: process.env.API_SCHEMES ?? "http",
    API_KEY: process.env.API_KEY ?? "your_api_key",
};

export const PostgresConfig = {
    HOST: process.env.PG_HOST ?? "127.0.0.1",
    PORT: Number(process.env.PG_PORT ?? 5432),
    USER: process.env.PG_USER ?? "postgres",
    PASSWORD: process.env.PG_PASSWORD ?? "postgres",
    DATABASE: process.env.PG_DATABASE ?? "avenir",
    SSL: process.env.PG_SSL === "true",
};

export const RewardConfig = {
    POINTS_PER_VND: Number(process.env.POINTS_PER_VND ?? 1 / 10000),
    REDEEM_RATE_VND_PER_POINT: Number(process.env.REDEEM_RATE_VND_PER_POINT ?? 1), // 1 point = 1 VND (1:1 ratio)
    REVIEW_POINTS: Number(process.env.REVIEW_POINTS ?? 50),
};

export const OrchaiDBConfig = {
    CONNECTION_URL: process.env.ORCHAI_DB_CONNECTION_URL ?? "mongodb://localhost:27017",
    USERNAME: process.env.ORCHAI_DB_USERNAME,
    PASSWORD: process.env.ORCHAI_DB_PASSWORD,

    ORCHAI_DATABASE: process.env.ORCHAI_DB_DATABASE ?? "orchai_database",
    SOLANA_SMART_LIQUIDITY_DATABASE: process.env.SOLANA_SMART_LIQUIDITY_DATABASE ?? "solana_smart_liquidity",
    MONEY_MARKET_V2_DATABASE: process.env.MONEY_MARKET_V2_DATABASE ?? "money_market_v2",
};

export const RedisConfig = {
    URL: process.env.REDIS_URL,
    HOST: process.env.REDIS_HOST ?? "127.0.0.1",
    PORT: Number(process.env.REDIS_PORT ?? 6379),
    PASSWORD: process.env.REDIS_PASSWORD,
    DEFAULT_TTL_SECONDS: Number(process.env.REDIS_DEFAULT_TTL_SECONDS ?? 10),
};

export const CryptoConfig = {
    PASSWORD: process.env.PASSWORD ?? "",
    MNEMONIC_FILE: path.join(SECRETS_DIR, process.env.MNEMONIC_FILE ?? "mnemonic.txt"),
};
