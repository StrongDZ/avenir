import React from "react";
import { HealthInput } from "../types/recommendation";

export function useHealthInput(initial?: Partial<HealthInput>) {
    const [form, setForm] = React.useState<HealthInput>({
        skinType: "oily",
        stressLevel: "medium",
        dietHabit: "balanced",
        sleepHours: "6-8",
        wellnessGoal: "energy",
        ...initial,
    });
    const update = (patch: Partial<HealthInput>) => setForm((f) => ({ ...f, ...patch }));
    return { form, update, setForm };
}
