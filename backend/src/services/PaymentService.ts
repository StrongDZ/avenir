export interface PaymentRequest {
    userId: string;
    amount: number;
    token?: string;
}

export class PaymentService {
    public async validate(request: PaymentRequest): Promise<boolean> {
        const { amount, token } = request;
        if (amount <= 0) return true;
        if (!token) return false;
        if (token.trim().toLowerCase() === "fail") return false;
        // simulate gateway latency
        await new Promise((resolve) => setTimeout(resolve, 200));
        return true;
    }
}
