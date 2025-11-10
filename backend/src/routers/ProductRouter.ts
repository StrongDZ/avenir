import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

export class ProductRouter {
    public router: Router;
    private controller: ProductController;

    constructor() {
        this.router = Router();
        this.controller = new ProductController();
        this.routes();
    }

    private routes() {
        this.router.get("/", this.controller.getProducts);
        this.router.get("/search", this.controller.search);
        this.router.get("/brands", this.controller.getBrands);
        this.router.get("/:id", this.controller.getProductById);
    }
}
