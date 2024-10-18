import Joi from "joi";

export const createUserSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    isAdmin: Joi.boolean().default(false)
});

export const updateUserSchema = Joi.object({
    username: Joi.string(),
    password: Joi.string().min(6),
    isAdmin: Joi.boolean()
}).min(1);