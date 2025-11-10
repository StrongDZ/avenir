import { withClient } from "../common/connections/Postgres";

const DEMO_USER = process.env.DEMO_USER_ID || "demo-user";

(async () => {
    await withClient(async (client) => {
        await client.query("begin");
        try {
            await client.query(`insert into users (id) values ($1) on conflict (id) do nothing`, [DEMO_USER]);
            await client.query(`insert into carts (user_id) values ($1) on conflict (user_id) do nothing`, [DEMO_USER]);
            await client.query(`delete from cart_items where user_id = $1`, [DEMO_USER]);
            await client.query(`delete from order_items where order_id in (select id from orders where user_id = $1)`, [DEMO_USER]);
            await client.query(`delete from orders where user_id = $1`, [DEMO_USER]);
            await client.query(`delete from reward_transactions where user_id = $1`, [DEMO_USER]);
            await client.query("commit");
            console.log("Demo reset done for user:", DEMO_USER);
        } catch (e) {
            await client.query("rollback");
            throw e;
        }
    });
})();
