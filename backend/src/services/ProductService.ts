import { ProductRepository } from "../models/repositories/ProductRepository";
import { Product } from "../models/entities/Product";

export class ProductService {
    private productRepo: ProductRepository;

    constructor() {
        this.productRepo = new ProductRepository();
    }

    public async listProducts(): Promise<Product[]> {
        return this.productRepo.findAll();
    }

    public async searchPaged(params: {
        q?: string;
        brand?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{ items: Product[]; total: number; page: number; pageSize: number }> {
        const page = Math.max(1, Number(params.page ?? 1));
        const pageSize = Math.max(1, Math.min(100, Number(params.pageSize ?? 10)));
        return this.productRepo.searchPaged({ q: params.q, brand: params.brand, page, pageSize });
    }

    public async getAllBrands(): Promise<Array<{ id: string; name: string }>> {
        return this.productRepo.getAllBrands();
    }

    public async getProductById(id: string): Promise<Product | null> {
        return this.productRepo.findById(id);
    }
}
