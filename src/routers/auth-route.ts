import { container} from "tsyringe";
import AuthController from "../controller/auth-controller";
import express,{ Request,Response } from "express";
import authValidationSchema from "../validators/auth-validation-schema";
import { validator } from "../middleware/index.validator";


const authService = container.resolve(AuthController)
const Router = express.Router()
const authRouter=()=>{
    Router.post('/signup',validator(authValidationSchema.signupValidation),(req:Request,res:Response)=>{
        authService.Register(req,res)});
}

export default authRouter;