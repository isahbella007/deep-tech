import { Router } from "express";
import authRoutes from "../api/auth/auth.routes";
import { adminRequired, ensureAuthenticated } from "../middleware/security";
import userRoutes from "../api/user/user.routes";
import productRoute from "../api/product/product.routes";
import cartRoutes from "../api/cart/cart.routes";

const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/user',  userRoutes )
routes.use('/product', ensureAuthenticated, adminRequired, productRoute)
routes.use('/cart', cartRoutes)
export default routes 