import mongoose, { Types } from "mongoose";
import CartModel, { ICart, ICartItem } from "../../../db/models/cart";
import ProductModel from "../../../db/models/product";
import { ErrorBuilder } from "../../../utils/errorHandler/ErrorBuilder";
import {v4 as uuidv4} from 'uuid'

export class CartService {

  async addToCart(userId: mongoose.Schema.Types.ObjectId | null, cartId: string | null, productId: string, quantity: number): Promise<ICart> {
    const cart = await this.getOrCreateCart(userId, cartId);
    const product = await ProductModel.findById(productId);

    if (!product) {
      throw ErrorBuilder.notFound('Product not found');
    }

    const existingItemIndex = cart.items.findIndex((item:any) => item.product._id.toString() === productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: new Types.ObjectId(productId), quantity });
    }

    return await cart.save();
  }

  async updateCartItemQuantity(userId: mongoose.Schema.Types.ObjectId | null, cartId: string | null, productId: string, quantityChange: number): Promise<ICart> {
    const cart = await this.getOrCreateCart(userId, cartId);
    // console.log('Cart Service -> the cart', JSON.stringify(cart))
    const itemIndex = cart.items.findIndex((item:any) => item.product._id.toString() === productId);
  
    if (itemIndex === -1) {
      throw ErrorBuilder.notFound('Product not found in cart');
    }
  
    cart.items[itemIndex].quantity = quantityChange;
  
    if (cart.items[itemIndex].quantity <= 0) {
      // Remove the item if the quantity becomes 0 or negative
      cart.items.splice(itemIndex, 1);
    }
  
    return await cart.save();
  }

  async removeFromCart(userId: mongoose.Schema.Types.ObjectId | null, cartId: string | null, productId: string): Promise<ICart> {
    const cart = await this.getOrCreateCart(userId, cartId);
    cart.items = cart.items.filter((item:any) => item.product._id.toString() !== productId);
    return await cart.save();
  }

async clearCart(userId: mongoose.Schema.Types.ObjectId | null, cartId: string | null): Promise<ICart> {
  const cart = await this.getOrCreateCart(userId, cartId);
  cart.items = [];
  return await cart.save();
}

 

  async handleCartOnLogin(userId: mongoose.Types.ObjectId, sessionCartId: string | null): Promise<ICart> {
    let userCart:any = await CartModel.findOne({ user: userId });
    const sessionCart = sessionCartId ? await CartModel.findOne({ cartId: sessionCartId }) : null;

    if (userCart && sessionCart) {
        // Merge session cart into user cart
        userCart.items = this.mergeCartItems(userCart.items as unknown as ICart, sessionCart.items as unknown as ICart);
        //   delete the session cart after merging
        await CartModel.findByIdAndDelete(sessionCart._id)
        
    } else if (sessionCart) {
      // Convert session cart to user cart
      sessionCart.user = userId;
    //   sessionCart.cartId = null;
      userCart = sessionCart;
    } else if (!userCart) {
      // Create new cart for user if none exists
      const newCartId = uuidv4();
      userCart = new CartModel({ user: userId, cartId: newCartId, items: [] });
    }

    return await userCart.save();
  }

  async getOrCreateCart(userId: mongoose.Schema.Types.ObjectId | null, cartId: string | null): Promise<ICart> {
    // if (userId) {
    //   console.log('Cart Service -> says there is a user', userId)
    //   let cart = await CartModel.findOne({ user: userId });
    //   if (!cart) {
    //     cart = new CartModel({ user: userId, items: [] });
    //     await cart.save();
    //   }
    //   return cart;
    // } else if (cartId) {
    //   let cart = await CartModel.findOne({ cartId: cartId });
    //   console.log('CartService -> The cartId', cartId)
    //   if (!cart) {
    //     console.log('Cart Service -> there is no cart create')
    //     console.log('Cart Service -> cart Id', cartId)

    //     cart = new CartModel({
    //       user: userId || null,
    //       cartId: cartId, 
    //       items: []
    //     });
    //     await cart.save();
    //     console.log('Cart Service -> session cart Id. Create new', cartId)
    //   }

    //   console.log('Cart Service -> session cart Id. Create new', cartId)
    //   return cart;
    // } else {
    // //   const newCartId = uuidv4();
    // //   const cart = new CartModel({ cartId: newCartId, items: [] });
    // //   await cart.save();
    // //   return cart;
    // throw ErrorBuilder.badRequest('userId or cartId must be provided')
    // }

      

      let cart: ICart | null = null;

      if (userId) {
        cart = await CartModel.findOne({ user: userId }).populate('items.product');
        if (!cart) {
          cart = new CartModel({ user: userId, items: [] });
        }
      } else if (cartId) {
        cart = await CartModel.findOne({ cartId: cartId }).populate('items.product');
        if (!cart) {
          cart = new CartModel({ cartId: cartId, items: [] });
        }
      }

      if (!cart) {
        throw ErrorBuilder.badRequest('Unable to fetch cart')
      }

      if (cart.isNew) {
        await cart.save();
      }

      // If the cart was just created, we need to populate it after saving
      if (cart.isNew) {
        await cart.save();
        // Re-fetch the cart to ensure it's populated
        const savedCart = await CartModel.findById(cart._id).populate('items.product');
        if (!savedCart) {
          throw ErrorBuilder.badRequest('Failed to save and retrieve new cart');
        }
        cart = savedCart;
      }
      
      return cart
  }

  private mergeCartItems(userCart: ICart, sessionCart: ICart): mongoose.Types.DocumentArray<ICartItem> {
    const mergedItems = new mongoose.Types.DocumentArray<ICartItem>([]);
    
    // Add user cart items
    userCart.items.forEach(item => {
      mergedItems.push(item);
    });

    // Merge session cart items
    sessionCart.items.forEach(sessionItem => {
      const existingItem = mergedItems.find(item => item.product.toString() === sessionItem.product.toString());
      if (existingItem) {
        existingItem.quantity += sessionItem.quantity;
      } else {
        mergedItems.push(sessionItem);
      }
    });

    return mergedItems;
  }
}

export const cartService = new CartService();