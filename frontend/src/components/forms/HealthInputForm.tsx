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
            className="grid grid-cols-2 gap-4 mb-4"
        >
            <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Skin Type</span>
                <select
                    className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
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
            <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Stress Level</span>
                <select
                    className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
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
            <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Diet Habit</span>
                <select
                    className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
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
            <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Sleep Hours</span>
                <select
                    className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
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
            <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Wellness Goal</span>
                <select
                    className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
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
                <Button disabled={loading} className="w-full">
                    {loading ? "Loading..." : "Get Recommendations"}
                </Button>
            </div>
        </form>
    );
};
