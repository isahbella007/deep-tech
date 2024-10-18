import { Request, Response, NextFunction } from "express";
import { cartService } from "./service/cart.service";
import { ResponseFormatter } from "../../utils/errorHandler/ResponseFormatter";
import { ErrorBuilder } from "../../utils/errorHandler/ErrorBuilder";
import mongoose, { Types } from "mongoose";
import { addToCartSchema, updateCartItemSchema } from "./cart.validation";
import {v4 as uuidv4} from 'uuid'

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user ? req.user._id : null;
        let cartId = req.cookies.visitorCartId || null;

        // console.log('getCart -> initial details:', { userId, cartId });

        if (!userId && !cartId) {
          // Generate a new cartId for visitors without one
          cartId = uuidv4();
          // console.log('Generated new cartId for visitor:', cartId);
        }

        console.log('Cart Controller -> get Cart', userId, cartId)
        const cart = await cartService.getOrCreateCart(userId, cartId);

        console.log('Cart Controller -> get Cart', cart)

        if (!userId) {
          // Set or update the visitorCartId cookie
          res.cookie('visitorCartId', cart.cartId, { 
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            // secure: true, // Use secure cookies in production
            sameSite: 'none' 
          });
        }

        console.log('getCart -> final details:', { userId, cartId: cart.cartId });


      return ResponseFormatter.success(res, cart, 'Cart retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = addToCartSchema.validate(req.body);
      if (error) {
        throw ErrorBuilder.badRequest(error.details[0].message);
      }

      const userId = req.user ? req.user._id : null;
      const cartId = req.cookies.visitorCartId || null;

      if(!userId && !cartId){ 
        // create generate the cookie

      }
      const { productId, quantity } = value;

      const updatedCart = await cartService.addToCart(userId, cartId, productId, quantity);
      return ResponseFormatter.success(res, updatedCart, 'Item added to cart');
    } catch (error) {
      next(error);
    }
  }

  async updateCartItemQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantityChange } = req.body;
      // console.log('Cart Controller -> req.body', quantityChange, productId)
      const userId = req.user ? req.user._id : null;
      const cartId = req.cookies.visitorCartId || null;
  
      if (!productId || typeof quantityChange !== 'number') {
        throw ErrorBuilder.badRequest('Invalid input');
      }
  
      const updatedCart = await cartService.updateCartItemQuantity(userId, cartId, productId, quantityChange);
      return ResponseFormatter.success(res, updatedCart, 'Cart item quantity updated');
    } catch (error) {
      next(error);
    }
  }

  async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user ? req.user._id : null;
      const cartId = req.cookies.visitorCartId || null
      const productId = req.params.productId;

      const updatedCart = await cartService.removeFromCart(userId, cartId, productId);
      return ResponseFormatter.success(res, updatedCart, 'Item removed from cart');
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user ? req.user._id : null;
      const cartId = req.cookies.visitorCartId || null;

      const clearedCart = await cartService.clearCart(userId, cartId);
      return ResponseFormatter.success(res, clearedCart, 'Cart cleared');
    } catch (error) {
      next(error);
    }
  }

}

export const cartController = new CartController();