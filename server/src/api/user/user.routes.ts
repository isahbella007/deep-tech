import { Router } from "express";
import { userController } from "./user.controller";
import { ensureAuthenticated } from "../../middleware/security";


const userRoutes = Router()

userRoutes.get('/',ensureAuthenticated, userController.getAllUsers);
userRoutes.get('/products', userController.getProductNotLoggedIn)
userRoutes.get('/:id',ensureAuthenticated, userController.getUser);
userRoutes.patch('/:id', ensureAuthenticated, userController.updateUser);
userRoutes.delete('/:id',ensureAuthenticated, userController.deleteUser);

export default userRoutes
