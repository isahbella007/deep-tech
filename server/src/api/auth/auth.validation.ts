import Joi from 'joi';

export const registerSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    isAdmin: Joi.boolean().required(),
});

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});