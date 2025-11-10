export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    subtotal: number;
    discountVnd: number;
    total: number;
    status: string;
    createdAt: string;
    shippedAt?: string | null;
    deliveredAt?: string | null;
    closedAt?: string | null;
    items: OrderItem[];
}
