import React from "react";
import { Product } from "../../types/product";
import { Button } from "../common/Button";

interface Props {
    bundles: Record<string, Product[]>;
    onAdd: (id: string) => void;
}

export const BundleSuggestion: React.FC<Props> = ({ bundles, onAdd }) => {
    return (
        <div className="space-y-3">
            {Object.entries(bundles).map(([pid, list]) => (
                <div key={pid}>
                    <div className="text-sm text-gray-700 mb-1">For {pid}</div>
                    <div className="grid grid-cols-1 gap-2">
                        {list.map((p) => (
                            <div key={p.id} className="border p-2 flex items-center justify-between rounded">
                                <span>{p.name}</span>
                                <Button onClick={() => onAdd(p.id)} variant="secondary">
                                    Add
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
