import Joi from "joi"

export const addProductSchema = Joi.object({ 
    name: Joi.string().required(),
    description: Joi.string().max(225).required(),
    price: Joi.number().required(),
    quantity: Joi.number().required()
})

export const updateProductSchema = Joi.object({ 
    name: Joi.string().optional(),
    description: Joi.string().max(225).optional(),
    price: Joi.number().optional(),
    quantity: Joi.number().optional()
})