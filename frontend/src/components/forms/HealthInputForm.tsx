import React from "react";
import { HealthInput } from "../../types/recommendation";
import { Button } from "../common/Button";

interface Props {
    value: HealthInput;
    onChange: (patch: Partial<HealthInput>) => void;
    onSubmit: () => void;
    loading?: boolean;
}

export const HealthInputForm: React.FC<Props> = ({ value, onChange, onSubmit, loading }) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="grid grid-cols-2 gap-3 mb-4"
        >
            <label>
                Skin Type
                <select
                    className="border p-2 w-full bg-white text-black"
                    value={value.skinType}
                    onChange={(e) => onChange({ skinType: e.target.value })}
                >
                    {["oily", "dry", "combination", "sensitive", "normal", "dull"].map((v) => (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Stress Level
                <select
                    className="border p-2 w-full bg-white text-black"
                    value={value.stressLevel}
                    onChange={(e) => onChange({ stressLevel: e.target.value })}
                >
                    {["low", "medium", "high"].map((v) => (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Diet Habit
                <select
                    className="border p-2 w-full bg-white text-black"
                    value={value.dietHabit}
                    onChange={(e) => onChange({ dietHabit: e.target.value })}
                >
                    {["healthy", "balanced", "high_protein", "high_carb", "skip_meals"].map((v) => (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Sleep Hours
                <select
                    className="border p-2 w-full bg-white text-black"
                    value={value.sleepHours}
                    onChange={(e) => onChange({ sleepHours: e.target.value as HealthInput["sleepHours"] })}
                >
                    {[
                        { key: "1-4", label: "1 - 4 hours" },
                        { key: "4-6", label: "4 - 6 hours" },
                        { key: "6-8", label: "6 - 8 hours" },
                        { key: "8+", label: "More than 8 hours" },
                    ].map((opt) => (
                        <option key={opt.key} value={opt.key}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Wellness Goal
                <select
                    className="border p-2 w-full bg-white text-black"
                    value={value.wellnessGoal}
                    onChange={(e) => onChange({ wellnessGoal: e.target.value })}
                >
                    {["relax", "energy", "glow", "weight", "focus"].map((v) => (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    ))}
                </select>
            </label>
            <div className="col-span-2">
                <Button disabled={loading}>{loading ? "Loading..." : "Get Recommendations"}</Button>
            </div>
        </form>
    );
};
