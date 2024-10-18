import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).message('Invalid product ID'),
  quantity: Joi.number().integer().min(1).required()
});

export const updateCartItemSchema = Joi.object({
  productId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).message('Invalid product ID'),
  quantity: Joi.number().integer().min(0).required()
});