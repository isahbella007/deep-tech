import mongoose, { model } from "mongoose";

export interface IProduct extends Partial<Document> { 
    name: String, 
    description: String, 
    price: Float32Array, 
    quantity: Number, 
    imageUrl?: String
}
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: false },
}, { timestamps: true });

const ProductModel = model<IProduct>('Product', productSchema);
export default ProductModel