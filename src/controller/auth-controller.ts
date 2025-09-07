import { Response,Request } from "express";
import { autoInjectable } from "tsyringe";
import AuthService from "../services/auth-service";
import { IuserCreationBody } from "../Interface/auth-interface";
import bcrypt from  'bcryptjs'
import { ResponseCode, userRoles } from "../enums/status-code";
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
                isEmailVerified: params.isEmailVerified
            } as IuserCreationBody
            
            let userExists= await this.authService.findUser({email:newUser.email,companyName:newUser.companyName,username:newUser.username})
            if(userExists){
                return utility.handleError(res, 'server error, signup failed', ResponseCode.ALREADY_EXIST)
            }
            let user = await this.authService.createUser(newUser)
                newUser.password='';
                return utility.handleSuccess(res,'successfully created new user',{user},ResponseCode.SUCCESS)
        }
        catch(err){
            return res.status(500).send('server error, signup failed')
        }
    };

    async verifyUser(res:Response,req:Request){
        
    }

    async signupWithGoogle(req:Request,res:Response){}
}

export default AuthController;