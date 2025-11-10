import React from "react";
import { Button } from "../common/Button";

export const CartSummary: React.FC<{ onCheckout: () => void }> = ({ onCheckout }) => {
    return (
        <div className="mt-3">
            <Button onClick={onCheckout}>Go to Checkout</Button>
        </div>
    );
};
