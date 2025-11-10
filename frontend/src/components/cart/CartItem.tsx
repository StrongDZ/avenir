import React from "react";
import { Button } from "../common/Button";

interface Props {
    productId: string;
    quantity: number;
    onRemove: (productId: string) => void;
}

export const CartItem: React.FC<Props> = ({ productId, quantity, onRemove }) => {
    return (
        <div className="border p-2 flex items-center justify-between rounded">
            <div>
                {productId} × {quantity}
            </div>
            <Button variant="danger" onClick={() => onRemove(productId)}>
                Remove
            </Button>
        </div>
    );
};
