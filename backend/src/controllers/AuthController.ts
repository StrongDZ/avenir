import { Request, Response } from "express";
import { sendRes } from "../utils/ResUtils";
import { UserRepository } from "../models/repositories/UserRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export class AuthController {
    private userRepo = new UserRepository();

    constructor() {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.me = this.me.bind(this);
    }

    public async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body || {};
            if (!username || !password) throw new Error("username and password are required");
            const normalizedUsername = String(username).trim();
            if (normalizedUsername.length < 3) throw new Error("username must be at least 3 characters");
            const existing = await this.userRepo.findByUsername(normalizedUsername);
            if (existing) throw new Error("username already registered");
            const hash = await bcrypt.hash(password, 10);
            const user = await this.userRepo.createWithPassword(normalizedUsername, hash);
            const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
            sendRes(res, null, { token, user });
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body || {};
            if (!username || !password) throw new Error("username and password are required");
            const normalizedUsername = String(username).trim();
            const user = await this.userRepo.findByUsername(normalizedUsername);
            if (!user) throw new Error("invalid credentials");
            const hash = await this.userRepo.getPasswordHash(normalizedUsername);
            const ok = !!hash && (await bcrypt.compare(password, hash));
            if (!ok) throw new Error("invalid credentials");
            const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
            sendRes(res, null, { token, user });
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async me(req: Request, res: Response) {
        try {
            const auth = String(req.headers.authorization || "");
            const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
            if (!token) throw new Error("unauthorized");
            const payload = jwt.verify(token, JWT_SECRET) as any;
            const userId = payload.sub as string;
            const user = await this.userRepo.findById(userId);
            if (!user) throw new Error("user not found");
            sendRes(res, null, user);
        } catch (e: any) {
            sendRes(res, e);
        }
    }
}
