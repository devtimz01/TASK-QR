import passport from 'passport'
import {Strategy as googleStrategy} from 'passport-google-oauth20'
import dotenv from 'dotenv'
dotenv.config()
import AuthService from './auth-service'
import {container} from 'tsyringe'
import { IuserCreationBody } from '../Interface/auth-interface'

const authService = container.resolve(AuthService)

passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID as string,
    clientSecret:process.env.CLIENT_SECRET  as string,
    callbackURL:'http://localhost:4033/api/auth/googlesignup'
},async (accessToken, refreshToken,profile,done)=>{
    const user = await authService.signUpwithGoogle({
    id: profile.id ,
    username: profile.displayName,
    email:profile.emails?.[0]?.value,
}) as IuserCreationBody
    return done(null,user)
}));

passport.serializeUser((user:Partial<IuserCreationBody>,done)=>{
    done(null,user.id)
})
passport.deserializeUser(async(id :string,done)=>{
    const user = await authService.findUser({id:id})
    done(null,user)
})

export default passport;