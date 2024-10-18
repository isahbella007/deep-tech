import { Router } from "express";
import { productController } from "./product.controller";

const productRoute = Router()

productRoute.post('/', productController.addProduct)
productRoute.get('/', productController.getAllProducts)
productRoute.get('/:id', productController.getProduct)
productRoute.patch('/:id', productController.updateProduct)
productRoute.delete('/:id', productController.deleteProduct)

export default productRoute