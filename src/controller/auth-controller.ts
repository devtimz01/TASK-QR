import { Response,Request } from "express";
import { autoInjectable } from "tsyringe";
import AuthService from "../services/auth-service";
import { IuserCreationBody } from "../Interface/auth-interface";
import bcrypt from  'bcryptjs'
import { emailStatus, ResponseCode, userRoles } from "../enums/status-code";
import utility from "../utils/log";

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

            let userCredentials=  {email:params.email,companyName:params.companyName,username:params.username} 
            let userExists= await this.authService.findUser(userCredentials);
            if(userExists){
                return utility.handleError(res, 'user already exists', ResponseCode.ALREADY_EXIST)
            }
            let user = await this.authService.createUser(newUser)
                return utility.handleSuccess(res,'successfully created new user',{user},ResponseCode.SUCCESS)
        }
        catch(error){
            return utility.handleError(res,(error as TypeError).message,ResponseCode.SERVER_ERROR)
        }
    };
    async verifyUser(req:Request,res:Response){
        
    }
    async signupWithGoogle(req:Request,res:Response){

    }
};

export default AuthController;