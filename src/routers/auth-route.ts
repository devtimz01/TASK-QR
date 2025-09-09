import { container} from "tsyringe";
import AuthController from "../controller/auth-controller";
import express,{ Request,Response } from "express";
import authValidationSchema from "../validators/auth-validation-schema";
import { validator } from "../middleware/index.validator";

const router = express.Router()
const authService = container.resolve(AuthController)

router.post('/signup',validator(authValidationSchema.signupValidation),async(req:Request,res:Response)=>{
      return authService.Register(req,res);});

export default router;