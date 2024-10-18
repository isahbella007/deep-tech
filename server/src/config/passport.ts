import passport from "passport"
import {Strategy as LocalStrategy} from "passport-local"
import UserModel from "../db/models/user"

export const passportSetup = () => { 
    passport.use(new LocalStrategy({ 
        usernameField: 'username', 
        passwordField: 'password', 
    }, async(username, password, done) => { 
        try {
            const user:any = await UserModel.findOne({username});
            if (!user) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            
            const isMatched = await user.comparePasswords(password);

            if (isMatched) { 
                // console.log('Authentication successful');
                return done(null, user);
            } else { 
                return done(null, false, { message: 'Incorrect username or password' });
            }
        } catch (error) { 
            return done(error);
        }  
    }));

    
}
passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});