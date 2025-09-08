import { container} from "tsyringe";
import AuthController from "../controller/auth-controller";
import express,{ Request,Response } from "express";
import authValidationSchema from "../validators/auth-validation-schema";
import { validator } from "../middleware/index.validator";

const router = express.Router()
const authService = container.resolve(AuthController)

const authRouter=()=>{
    router.post('/signup',validator(authValidationSchema.signupValidation),(req:Request,res:Response)=>{
       authService.Register(req,res); });
       return router;
}

export default authRouter;