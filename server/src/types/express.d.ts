import { IUser } from "../db/models/user";

declare global{ 
    namespace Express{ 
        interface User extends IUser{}
    }
}