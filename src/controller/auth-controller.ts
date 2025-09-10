import { Response,Request } from "express";
import { autoInjectable } from "tsyringe";
import AuthService from "../services/auth-service";
import { IuserCreationBody } from "../Interface/auth-interface";
import bcrypt from  'bcryptjs'
import { emailStatus, ResponseCode, userRoles } from "../enums/status-code";
import utility from "../utils/log";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

@autoInjectable()
class AuthController{
    private authService: AuthService
    constructor(_authservice: AuthService){
        this.authService= _authservice
    }
    async Register(req: Request,res:Response){
        const params={...req.body}
        try{
            const saltround = 10;
            const hashedPassword = bcrypt.hashSync(params.password,saltround) 
            const newUser = 
                {fullName: params.fullName,
                username: params.username,
                companyName: params.companyName,
                email:params.email,
                password: hashedPassword,
                role: userRoles.USER,
               isEmailVerified: emailStatus.NOT_VERIFIED
            } as IuserCreationBody

            let userExists= await this.authService.findUser({email:params.email});
            if(userExists){
                return utility.handleError(res, 'user already exists', ResponseCode.ALREADY_EXIST)
            }
            //verify user
            let user = await this.authService.createUser(newUser)
                return utility.handleSuccess(res,'successfully created new user',{user},ResponseCode.SUCCESS)
        }
        catch(error){
            return utility.handleError(res,(error as TypeError).message,ResponseCode.SERVER_ERROR)
        }
    };
    async login (req:Request,res:Response){
        try{
            const params={...req.body}
            let user = await this.authService.findUser({username:params.username})
            if(!user){
                return utility.handleError(res,"user does not exist",ResponseCode.UNAUTHORIZED_ACCESS)
            }
            let isPasswordMatch = await bcrypt.compare(params.password, user.password)
                if(!isPasswordMatch){
                   return utility.handleError(res,"invalid password match",ResponseCode.UNAUTHORIZED_ACCESS)}
                      let token = jwt.sign({
                        userId: user.id,
                        username: user.username,
                        email: user.email,
                        companyName:user.companyName
                      }, process.env.JWT_SECRET as string,{expiresIn:'30d'})
                       return utility.handleSuccess(res,"login successful",{user,token},ResponseCode.OK)
        }catch(error){
            return utility.handleError(res, (error as TypeError).message,ResponseCode.SERVER_ERROR)
        }
    }

};

export default AuthController;