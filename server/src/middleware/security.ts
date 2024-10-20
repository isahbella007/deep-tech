import { NextFunction, Response, Request, RequestHandler } from "express";
import { ErrorBuilder } from "../utils/errorHandler/ErrorBuilder";

export const ensureAuthenticated: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    console.log('Session in ensureAuthenticated:', req.session);
    console.log('User in ensureAuthenticated:', req.user);
    console.log('IsAuthenticated:', req.isAuthenticated());
    console.log('Cookies:', req.headers.cookie);
    
    if (req.isAuthenticated()) {
        // think of any check to happen and add it here if needed otherwise, proceed
        next();  // User is authenticated, proceed
    } else {
        const error = ErrorBuilder.unauthorized('Unauthorized: Please log in first');
        next(error);
    }
};

export const adminRequired: RequestHandler = (req:Request, res:Response, next:NextFunction) => { 
    const isAdmin = req.user?.isAdmin
    if(isAdmin){ 
        next()
    }else{ 
        const error = ErrorBuilder.unauthorized('Unauthorized: Admin only')
        next(error)
    }
}