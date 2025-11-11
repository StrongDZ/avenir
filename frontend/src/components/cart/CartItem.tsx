import React from "react";
import { Button } from "../common/Button";

interface Props {
    productId: string;
    quantity: number;
    onRemove: (productId: string) => void;
}

export const CartItem: React.FC<Props> = ({ productId, quantity, onRemove }) => {
    return (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <div className="text-gray-900">
                {productId} × {quantity}
            </div>
            <Button variant="danger" onClick={() => onRemove(productId)}>
                Remove
            </Button>
        </div>
    );
};
