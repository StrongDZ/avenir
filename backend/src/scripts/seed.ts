import { readFileSync } from "fs";
import path from "path";
import { withClient } from "../common/connections/Postgres";

async function ensureSchema() {
    await withClient(async (client) => {
        await client.query(`
        create extension if not exists "uuid-ossp";
        create table if not exists brands (
            id text primary key,
            name text not null,
            currency text not null
        );
        create table if not exists products (
            id text primary key,
            brand_id text references brands(id),
            name text not null,
            price integer not null,
            tags jsonb not null default '[]',
            attributes jsonb not null default '{}'::jsonb
        );
        create table if not exists users (
            id text primary key,
            created_at timestamptz not null default now()
        );
        alter table users add column if not exists username text;
create unique index if not exists users_username_unique on users(username);
        alter table users add column if not exists password_hash text;
        create table if not exists carts (
            user_id text primary key references users(id),
            updated_at timestamptz not null default now()
        );
        create table if not exists cart_items (
            user_id text references carts(user_id),
            product_id text references products(id),
            quantity integer not null,
            primary key (user_id, product_id)
        );
        create table if not exists orders (
            id uuid primary key default uuid_generate_v4(),
            user_id text references users(id),
            subtotal integer not null,
            discount_vnd integer not null,
            total integer not null,
            status text not null default 'Pending',
            shipped_at timestamptz,
            delivered_at timestamptz,
            closed_at timestamptz,
            created_at timestamptz not null default now()
        );
        create table if not exists order_items (
            order_id uuid references orders(id),
            product_id text references products(id),
            quantity integer not null,
            price integer not null,
            primary key (order_id, product_id)
        );
        alter table orders add column if not exists status text not null default 'Pending';
        alter table orders add column if not exists shipped_at timestamptz;
        alter table orders add column if not exists delivered_at timestamptz;
        alter table orders add column if not exists closed_at timestamptz;
        create table if not exists order_reviews (
            id uuid primary key default uuid_generate_v4(),
            order_id uuid references orders(id) on delete cascade,
            user_id text references users(id),
            rating integer not null,
            comment text,
            created_at timestamptz not null default now()
        );
        create unique index if not exists order_reviews_order_unique on order_reviews(order_id);
        create table if not exists reward_transactions (
            id uuid primary key default uuid_generate_v4(),
            user_id text references users(id),
            type text not null,
            points integer not null,
            created_at timestamptz not null default now(),
            meta jsonb not null default '{}'::jsonb
        );
        `);
    });
}

async function seedData() {
    const dataPath = path.resolve(__dirname, "..", "..", "..", "data", "products.json");
    const raw = JSON.parse(readFileSync(dataPath, "utf-8"));
    const brands = raw.brands as Array<{ id: string; name: string; currency: string }>;
    const products = raw.products as Array<any>;

    await withClient(async (client) => {
        await client.query("begin");
        try {
            for (const b of brands) {
                await client.query(
                    `insert into brands (id, name, currency) values ($1, $2, $3)
                     on conflict (id) do update set name = excluded.name, currency = excluded.currency`,
                    [b.id, b.name, b.currency]
                );
            }
            for (const p of products) {
                await client.query(
                    `insert into products (id, brand_id, name, price, tags, attributes)
                     values ($1, $2, $3, $4, $5, $6)
                     on conflict (id) do update set brand_id = excluded.brand_id, name = excluded.name, price = excluded.price, tags = excluded.tags, attributes = excluded.attributes`,
                    [p.id, p.brandId, p.name, p.price, JSON.stringify(p.tags ?? []), JSON.stringify(p.attributes ?? {})]
                );
            }
            await client.query("commit");
            console.log("Seed completed.");
        } catch (e) {
            await client.query("rollback");
            throw e;
        }
    });
}

(async () => {
    await ensureSchema();
    await seedData();
})();
