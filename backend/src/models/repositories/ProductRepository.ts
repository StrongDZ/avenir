import { withClient } from "../../common/connections/Postgres";
import { Product } from "../entities/Product";

export class ProductRepository {
    public async findAll(): Promise<Product[]> {
        return withClient(async (client) => {
            const r = await client.query("select id, brand_id, name, price, tags, attributes from products order by name asc");
            return r.rows.map(this.mapRow);
        });
    }

    public async searchPaged(params: { q?: string; brand?: string; page: number; pageSize: number }): Promise<{
        items: Product[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        const { q, brand, page, pageSize } = params;
        const offset = (page - 1) * pageSize;
        return withClient(async (client) => {
            const conditions: string[] = [];
            const args: any[] = [];
            let argIndex = 1;

            if (q && q.trim().length > 0) {
                conditions.push(`name ilike $${argIndex}`);
                args.push(`%${q.trim()}%`);
                argIndex++;
            }

            if (brand && brand.trim().length > 0) {
                conditions.push(`brand_id ilike $${argIndex}`);
                args.push(`%${brand.trim()}%`);
                argIndex++;
            }

            const where = conditions.length > 0 ? `where ${conditions.join(" and ")}` : ``;
            const countSql = `select count(*)::int as count from products ${where}`;
            const listSql = `select id, brand_id, name, price, tags, attributes
                             from products ${where}
                             order by name asc
                             limit $${argIndex} offset $${argIndex + 1}`;
            const countRes = await client.query(countSql, args);
            const total = countRes.rows[0]?.count ?? 0;
            const listRes = await client.query(listSql, [...args, pageSize, offset]);
            return {
                items: listRes.rows.map(this.mapRow),
                total,
                page,
                pageSize,
            };
        });
    }

    public async findById(id: string): Promise<Product | null> {
        return withClient(async (client) => {
            const r = await client.query("select id, brand_id, name, price, tags, attributes from products where id = $1", [id]);
            if (r.rows.length === 0) return null;
            return this.mapRow(r.rows[0]);
        });
    }

    public async findByIds(ids: string[]): Promise<Product[]> {
        if (ids.length === 0) return [];
        return withClient(async (client) => {
            const r = await client.query("select id, brand_id, name, price, tags, attributes from products where id = any($1)", [ids]);
            return r.rows.map(this.mapRow);
        });
    }

    public async findMatchingByAttributes(filter: {
        skinType?: string;
        stressLevel?: string;
        dietHabit?: string;
        sleepHours?: string;
        wellnessGoal?: string;
    }): Promise<Product[]> {
        return withClient(async (client) => {
            const r = await client.query(`select id, brand_id, name, price, tags, attributes from products`);
            const all = r.rows.map(this.mapRow);
            return all.filter((p: Product) => {
                const a = p.attributes || {};
                const skinMatch = filter.skinType ? (a.skinType || []).includes(filter.skinType) : false;
                const stressMatch = filter.stressLevel ? (a.wellness || []).includes("stress") : false;
                const dietMatch = filter.dietHabit ? (a.diet || []).includes(filter.dietHabit) : false;
                const goal = filter.wellnessGoal;
                const energyMatch = goal === "energy" && (a.symptom || []).includes("low_energy");
                const relaxMatch = goal === "relax" && (a.benefits || []).includes("calm");
                const glowMatch = goal === "glow" && (a.benefits || []).includes("glow");
                const sleepMatch = filter.sleepHours ? (a.sleepRange || []).includes(filter.sleepHours) : false;
                return skinMatch || stressMatch || dietMatch || energyMatch || relaxMatch || glowMatch || sleepMatch;
            });
        });
    }

    public async getAllBrands(): Promise<Array<{ id: string; name: string }>> {
        return withClient(async (client) => {
            const r = await client.query("select id, name from brands order by name asc");
            return r.rows.map((row: any) => ({ id: row.id, name: row.name }));
        });
    }

    private mapRow = (row: any): Product => ({
        id: row.id,
        brandId: row.brand_id,
        name: row.name,
        price: row.price,
        tags: row.tags ?? [],
        attributes: row.attributes ?? {},
    });
}
