import mongoose, { model } from "mongoose";
import bcrypt from "bcrypt"

export interface IUser extends Partial<Document>{ 
    _id: mongoose.Schema.Types.ObjectId,
    username: string, 
    password: string, 
    isAdmin: Boolean
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.methods.comparePasswords = async function (this: IUser, password: string) {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.password) {
        // console.log('No password set for this user');
        reject(new Error('No password set'));
        return;
      }
      
      bcrypt.compare(password, this.password, (err, result) => {
        if (err) {
          // console.log('bcrypt.compare -> err:', err);
          reject(err);
        } else {
          // console.log('bcrypt.compare -> result:', result);
          resolve(result);
        }
      });
    });
  };

const UserModel = model<IUser>('User', userSchema);

export default UserModel