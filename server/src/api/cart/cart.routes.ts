import express from 'express';
import { cartController } from './cart.controller';

const cartRoutes = express.Router();

cartRoutes.get('/', cartController.getCart);
cartRoutes.post('/add', cartController.addToCart);
cartRoutes.patch('/update', cartController.updateCartItemQuantity);
cartRoutes.delete('/remove/:productId', cartController.removeFromCart);
cartRoutes.delete('/clear', cartController.clearCart);

export default cartRoutes;