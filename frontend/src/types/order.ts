export interface OrderSummary {
    orderId: string;
    subtotal: number;
    discountVnd: number;
    total: number;
    earned: number;
    status: string;
}

export interface OrderItem {
    productId: string;
    quantity: number;
    price: number;
}

export interface OrderDetail {
    id: string;
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
