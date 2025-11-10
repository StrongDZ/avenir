import { apiClient } from "./apiClient";
import { Product } from "../types/product";

export const productService = {
    list(): Promise<Product[]> {
        return apiClient.get<Product[]>("/products");
    },
    search(params: {
        q?: string;
        brand?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{ items: Product[]; total: number; page: number; pageSize: number }> {
        const q = params.q ? `q=${encodeURIComponent(params.q)}` : "";
        const brand = params.brand ? `brand=${encodeURIComponent(params.brand)}` : "";
        const page = params.page ? `page=${params.page}` : "";
        const pageSize = params.pageSize ? `pageSize=${params.pageSize}` : "";
        const qs = [q, brand, page, pageSize].filter(Boolean).join("&");
        const suffix = qs ? `?${qs}` : "";
        return apiClient.get(`/products/search${suffix}`);
    },
    getBrands(): Promise<Array<{ id: string; name: string }>> {
        return apiClient.get("/products/brands");
    },
    getById(id: string): Promise<Product> {
        return apiClient.get(`/products/${encodeURIComponent(id)}`);
    },
};
