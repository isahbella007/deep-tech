import ProductModel, { IProduct } from "../../../db/models/product";
import { ErrorBuilder } from "../../../utils/errorHandler/ErrorBuilder";

export class ProductService{ 
    async addProduct(productData: IProduct):Promise<IProduct>{ 
        const{name, description, price, quantity} = productData

        const existingProduct = await ProductModel.findOne({name: name})
        if(existingProduct){ 
            throw ErrorBuilder.badRequest('Product with this name exist')
        }
        const newProduct = new ProductModel({ 
            name: name, 
            description: description, 
            price: price, 
            quantity: quantity
        })

        await newProduct.save()
        return newProduct
    }

    async getAllProducts(): Promise<IProduct[]> {
        return await ProductModel.find();
    }

    async getProduct(productId: string): Promise<IProduct> {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw ErrorBuilder.notFound('Product not found');
        }
        return product;
    }

    async editProduct(productId: string, updateData: Partial<IProduct>): Promise<IProduct> {
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw ErrorBuilder.notFound('Product not found');
        }

        if (updateData.name && updateData.name !== product.name) {
            const existingProduct = await ProductModel.findOne({ name: updateData.name });
            if (existingProduct) {
                throw ErrorBuilder.badRequest('Product with this name already exists');
            }
        }

        Object.assign(product, updateData);
        await product.save();
        return product;
    }

    async deleteProduct(productId: string): Promise<void> {
        const result = await ProductModel.findByIdAndDelete(productId);
        if (!result) {
            throw ErrorBuilder.notFound('Product not found');
        }
    }
}
export const productService = new ProductService();
