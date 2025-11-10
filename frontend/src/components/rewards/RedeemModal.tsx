import React from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";

export const RedeemModal: React.FC<{ open: boolean; onClose: () => void; onConfirm: (points: number) => void }> = ({ open, onClose, onConfirm }) => {
    const [points, setPoints] = React.useState(0);
    return (
        <Modal open={open} onClose={onClose} title="Redeem Points">
            <div className="space-y-3">
                <input type="number" className="border p-2 w-full" value={points} onChange={(e) => setPoints(Number(e.target.value))} />
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => onConfirm(points)}>Confirm</Button>
                </div>
            </div>
        </Modal>
    );
};
