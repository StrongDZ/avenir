export interface Product {
    id: string;
    brandId: string;
    name: string;
    price: number;
    tags: string[];
    attributes: Record<string, unknown>;
    description?: string;
}
