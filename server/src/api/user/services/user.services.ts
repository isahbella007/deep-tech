import CartModel from "../../../db/models/cart";
import UserModel, { IUser } from "../../../db/models/user";
import { ErrorBuilder } from "../../../utils/errorHandler/ErrorBuilder";
import { hashPassword } from "../../../utils/passwordUtil";

export class UserService {

    async getUser(userId: string): Promise<IUser> {
        const user = await UserModel.findById(userId).select('-password');
        if (!user) {
            throw ErrorBuilder.notFound('User not found');
        }
        return user;
    }

    async getAllUsers(): Promise<IUser[]> {
        return await UserModel.find().select('-password');
    }

    async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw ErrorBuilder.notFound('User not found');
        }

        if (updateData.username && updateData.username !== user.username) {
            const existingUser = await UserModel.findOne({ username: updateData.username });
            if (existingUser) {
                throw ErrorBuilder.badRequest('User with this username already exists');
            }
        }

        if (updateData.password) {
            const {hash : passwordHash} = await hashPassword(updateData.password as string)
            updateData.password = passwordHash
        }

        Object.assign(user, updateData);
        await user.save();
        return user;
    }

    async deleteUser(userId: string): Promise<void> {
        const result = await UserModel.findByIdAndDelete(userId);
        // we also need to delete the cart associated with them 
        await CartModel.findByIdAndDelete({user: userId})
        if (!result) {
            throw ErrorBuilder.notFound('User not found');
        }
    }
}

export const userService = new UserService();