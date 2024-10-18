import passport from "passport";
import UserModel, { IUser } from "../../../db/models/user";
import { ErrorBuilder } from "../../../utils/errorHandler/ErrorBuilder";
import { hashPassword } from "../../../utils/passwordUtil";

export class AuthService{ 
    async registerUser(userData: Partial<IUser>): Promise<IUser>{ 
        const {username, password, isAdmin  } = userData

        const existingUser = await UserModel.findOne({username})
        if(existingUser){ 
            throw ErrorBuilder.badRequest('An account already exists with this email')
        }

        const { hash: passwordHash } = await hashPassword(password as string);
        const newUser = new UserModel({ 
            username: username, 
            password: passwordHash, 
            isAdmin: isAdmin
        })

        await newUser.save()

        return newUser
    }
}
export const authService = new AuthService();