export interface Product {
    id: string;
    brandId: string;
    name: string;
    price: number; // VND
    tags: string[];
    attributes: Record<string, any>;
    description?: string;
}
