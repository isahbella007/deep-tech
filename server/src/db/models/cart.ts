import mongoose, { Document, model, Types } from 'mongoose';
import ProductModel, { IProduct } from './product';
import UserModel, { IUser } from './user';

export interface ICartItem {
  product: Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICart extends Document {
  user: Types.ObjectId | IUser | null;
  cartId: string | null;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: ProductModel, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: UserModel, default: null },
  cartId: { type: String, default: null },
  items: [cartItemSchema],
}, { timestamps: true });

cartSchema.index({ user: 1, cartId: 1 }, { unique: true });

const CartModel = model('Cart', cartSchema);

export default CartModel