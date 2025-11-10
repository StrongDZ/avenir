export function formatCurrencyVnd(value: number): string {
    try {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
    } catch {
        return `${Math.round(value).toLocaleString()} VND`;
    }
}
