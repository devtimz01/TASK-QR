import { container} from "tsyringe";
import AuthController from "../controller/auth-controller";
import express,{ Request,Response } from "express";
import authValidationSchema from "../validators/auth-validation-schema";
import { validator } from "../middleware/index.validator";
import passport from '../services/passport'
import AuthService from "../services/auth-service";

const router = express.Router()
export const xservice = container.resolve(AuthService)
const authService = container.resolve(AuthController)

router.post('/signup',validator(authValidationSchema.signupValidation),(req:Request,res:Response)=>{
      return authService.Register(req,res);});

router.post('/signupAsAdmin',validator(authValidationSchema.signupValidation),(req:Request,res:Response)=>{
      return authService.signUpasAdmin(req,res);});

router.post('/login',(req,res)=>{
      return authService.login(req,res)
})
router.post('/loginAsAdmin',(req,res)=>{
      return authService.loginAsAdmin(req,res)
})
router.post('/sendVerificationMail', (req,res)=>{
      return authService.sendVerificationLink(req,res)
})
router.get('/verify',(req,res)=>{
      return authService.verifyUser(req,res)
})
router.get('/google',passport.authenticate('google',{scope:['profile','email']}))

router.get('/googlesignup',passport.authenticate('google',{failureRedirect:'/oauthfailed'}),(req,res)=>{
      return res.redirect('/')
})
export default router;