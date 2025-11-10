import React from "react";
import { cartService, CartItemDto } from "../services/cartService";

export function useCart(userId: string) {
    const [items, setItems] = React.useState<CartItemDto[]>([]);
    const [loading, setLoading] = React.useState(false);

    const refresh = React.useCallback(async () => {
        setLoading(true);
        const res = await cartService.get(userId);
        setItems(res.items);
        setLoading(false);
    }, [userId]);

    const add = React.useCallback(
        async (productId: string, quantity = 1) => {
            await cartService.add(userId, productId, quantity);
            await refresh();
        },
        [userId, refresh]
    );

    const updateQuantity = React.useCallback(
        async (productId: string, quantity: number) => {
            await cartService.updateQuantity(userId, productId, quantity);
            await refresh();
        },
        [userId, refresh]
    );

    const remove = React.useCallback(
        async (productId: string) => {
            await cartService.remove(userId, productId);
            setItems((prev) => prev.filter((i) => i.productId !== productId));
        },
        [userId]
    );

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    return { items, loading, refresh, add, updateQuantity, remove };
}
