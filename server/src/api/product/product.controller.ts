import { ErrorBuilder } from "../../utils/errorHandler/ErrorBuilder";
import { ResponseFormatter } from "../../utils/errorHandler/ResponseFormatter";
import { addProductSchema, updateProductSchema } from "./product.validation";
import { productService } from "./service/product.service";
import { Request, Response, NextFunction } from "express";
export class ProductController {
    async addProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { error, value } = addProductSchema.validate(req.body);
            if (error) {
                throw ErrorBuilder.badRequest(error.details[0].message);
            }

            const newProduct = await productService.addProduct(value);
            return ResponseFormatter.success(res, newProduct, 'Product Added ')
        } catch (error) {
            next(error)
        }
    }

    async getProduct(req: Request, res: Response, next:NextFunction) {
        try {
            const productId = req.params.id;
            const product = await productService.getProduct(productId);
            return ResponseFormatter.success(res, product, 'Single Product')
        } catch (error) {
            next(error)
        }
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await productService.getAllProducts();
            return ResponseFormatter.success(res, products, 'All Product')
        } catch (error) {
           next(error)
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id;
            const { error, value } = updateProductSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                throw ErrorBuilder.badRequest(error.details[0].message);
            }

            const updatedProduct = await productService.editProduct(productId, value);
            return ResponseFormatter.success(res, updatedProduct, 'Product Updated')
        } catch (error) {
            next(error)
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id;
            await productService.deleteProduct(productId);
            return ResponseFormatter.success(res, {}, 'Product Deleted')
        } catch (error) {
            next(error)
        }
    }
}

export const productController = new ProductController();