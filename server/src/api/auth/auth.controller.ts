import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { ErrorBuilder } from "../../utils/errorHandler/ErrorBuilder";
import { authService, AuthService } from "./service/auth.service";
import { ResponseFormatter } from "../../utils/errorHandler/ResponseFormatter";
import passport from "passport";
import { CartService, cartService } from "../cart/service/cart.service";
import mongoose, { Types } from "mongoose";

class AuthController { 
    async register(req: Request, res:Response, next: NextFunction){ 
       try{ 
        console.log('let us see if the session is changing here when they login', req.session.id)
            const {error, value} = registerSchema.validate(req.body)
            if (error) {
                throw ErrorBuilder.badRequest(error.details[0].message);
                
            }
            const user = await authService.registerUser(value)
            const responseData = {userId: user._id}
            return ResponseFormatter.success(res, responseData,'Registration Successful')
       }catch(error){ 
        next(error)
       }
    }

    async login(req:Request, res:Response, next:NextFunction){ 
        try{ 
            const {error, value} = loginSchema.validate(req.body)
            if (error) {
                throw ErrorBuilder.badRequest(error.details[0].message);
            }
            passport.authenticate('local', (err: any, user: any, info: any) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    console.log('There is no user at all ')
                    throw ErrorBuilder.badRequest('Invalid username or password');
                }
                
                req.logIn(user, async(err) => {
                    if (err) {
                        return next(err);
                    }
                    try {
                        const visitorCartId = req.cookies.visitorCartId || null;
        
                        if (visitorCartId) {
                          await cartService.handleCartOnLogin(user._id, visitorCartId);
                          res.clearCookie('visitorCartId');
                          res.clearCookie('cartId')
                        }
                        
                        // Set a secure cookie with the session ID
                        res.cookie('sessionId', req.sessionID, {
                            httpOnly: true,
                            secure: true,
                            sameSite: 'none',
                            // secure: false,
                            // sameSite: 'lax',
                            maxAge: 30 * 60 * 1000, // 30 minutes
                            // domain: '.onrender.com'
                        });

                        // Remove any session-related code if not needed
                        return ResponseFormatter.success(res, { user }, 'Login successful');

                        

                    } catch (mergeError) {
                        console.error('Error merging carts:', mergeError);
                        // Even if cart merging fails, we still want to complete the login process
                        return ResponseFormatter.success(res, { user }, 'Login successful, but there was an issue with your cart');
                    }
                });
            })(req, res, next) //make use of the passport.authenticate function
        }catch(error){ 
            next(error)
        }
    }
    async logout(req:Request, res:Response){ 
        req.logOut((err) => {
            if (err) {
                return res.status(500).json({ message: 'Error logging out.' });
            }
    
            // Destroy the session
            req.session.destroy((err) => {
                if (err) {
                    return ErrorBuilder.internal('Error destroying session');
                }

                // Clear the session cookie
                res.clearCookie('sessionId', {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                // Clear this incase it was not cleared when the visitor logs in
                res.clearCookie('visitorCartId', {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
    
                // Send a response indicating successful logout
                return ResponseFormatter.success(res, {}, 'Logged out successfully')
            });
        });
    }
}

export const authController = new AuthController();