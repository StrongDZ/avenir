import React from "react";
import { useCart } from "../hooks/useCart";

interface CartContextValue {
    items: { productId: string; quantity: number; product?: any }[];
    loading: boolean;
    refresh: () => Promise<void>;
    add: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    remove: (productId: string) => Promise<void>;
}

export const CartContext = React.createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
    const cart = useCart(userId);
    return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export function useCartContext() {
    const ctx = React.useContext(CartContext);
    if (!ctx) throw new Error("CartContext not available");
    return ctx;
}
