import { Request, Response } from "express";
import { sendRes } from "../utils/ResUtils";
import { ProductService } from "../services/ProductService";

export class ProductController {
    private productService = new ProductService();

    constructor() {
        this.getProducts = this.getProducts.bind(this);
        this.search = this.search.bind(this);
        this.getBrands = this.getBrands.bind(this);
        this.getProductById = this.getProductById.bind(this);
    }

    public async getProducts(req: Request, res: Response) {
        try {
            const products = await this.productService.listProducts();
            sendRes(res, null, products);
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async search(req: Request, res: Response) {
        try {
            const q = String(req.query.q ?? "");
            const brand = String(req.query.brand ?? "");
            const page = Number(req.query.page ?? 1);
            const pageSize = Number(req.query.pageSize ?? 10);
            const result = await this.productService.searchPaged({ q, brand, page, pageSize });
            sendRes(res, null, result);
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async getBrands(req: Request, res: Response) {
        try {
            const brands = await this.productService.getAllBrands();
            sendRes(res, null, brands);
        } catch (e: any) {
            sendRes(res, e);
        }
    }

    public async getProductById(req: Request, res: Response) {
        try {
            const id = String(req.params.id ?? "");
            if (!id) throw new Error("Product ID is required");
            const product = await this.productService.getProductById(id);
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }
            sendRes(res, null, product);
        } catch (e: any) {
            sendRes(res, e);
        }
    }
}
