import { NextFunction, RequestHandler, Request, Response } from "express";
import {v4 as uuidv4} from 'uuid'

export const persistCartId:RequestHandler = (req:Request, res:Response, next:NextFunction)=> { 
    if(!req.cookies.cartId){ 
        const cartId = uuidv4()
        res.cookie('cartId', cartId, { 
            httpOnly: true, 
            secure: false, 
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        req.cartId = cartId;
    }else {
        req.cartId = req.cookies.cartId;
    }

    next()
}