import { NextFunction, Response, Request } from "express";
import { userService } from "./services/user.services";
import { ResponseFormatter } from "../../utils/errorHandler/ResponseFormatter";
import { updateUserSchema } from "./user.validation";
import { ErrorBuilder } from "../../utils/errorHandler/ErrorBuilder";
import { productService } from "../product/service/product.service";

export class UserController {
    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const user = await userService.getUser(userId);
            return ResponseFormatter.success(res, user, 'User Details');
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers();
            return ResponseFormatter.success(res, users, 'All Users');
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const { error, value } = updateUserSchema.validate(req.body, { stripUnknown: true });
            if (error) {
                throw ErrorBuilder.badRequest(error.details[0].message);
            }

            const updatedUser = await userService.updateUser(userId, value);
            return ResponseFormatter.success(res, updatedUser, 'User Updated');
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            await userService.deleteUser(userId);
            return ResponseFormatter.success(res, {}, 'User Deleted');
        } catch (error) {
            next(error);
        }
    }

    // get product for people who are not logged in 
    async getProductNotLoggedIn(req:Request, res:Response, next:NextFunction){ 
        try{ 
            const result = await productService.getAllProducts()
            return ResponseFormatter.success(res, result, 'All products' )
        }catch(error){ 
            next(error)
        }
    }
}

export const userController = new UserController();