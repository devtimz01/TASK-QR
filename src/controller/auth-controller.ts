import { Response,Request } from "express";
import { autoInjectable } from "tsyringe";
import AuthService from "../services/auth-service";
import { IuserCreationBody } from "../Interface/auth-interface";
import bcrypt from  'bcryptjs'
import { emailStatus, ResponseCode, userRoles } from "../enums/status-code";
import utility from "../utils/log";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import moment from 'moment'
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
                return utility.handleError(res, 'user already exists', ResponseCode.CONFLICT)
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
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        companyName:user.companyName
                      }, process.env.JWT_SECRET as string,{expiresIn:'30d'})
                      //verifyUser()
                       return utility.handleSuccess(res,"login successful",{user,token},ResponseCode.OK)
        }catch(error){
            return utility.handleError(res, (error as TypeError).message,ResponseCode.SERVER_ERROR)
        }
    }
    async sendVerificationLink(req:Request,res:Response){
       try{
        const params={...req.body}
        const createTokenRecord = await this.authService.createTokenRecord(params.email)
        if(!createTokenRecord){
            return utility.handleError(res,"user could not create token record",ResponseCode.SERVER_ERROR)
        }
        const sendVerificationMail = AuthService.sendMail(params.email,{code:createTokenRecord.code})
        if(!sendVerificationMail){
            return utility.handleError(res,"Error, verification email not sent",ResponseCode.SERVER_ERROR)
        }
        return utility.handleSuccess(res,'verification mail sent successfully',{},ResponseCode.OK)
    } 
       catch(error){
            return utility.handleError(res,(error as TypeError).message,ResponseCode.SERVER_ERROR)
       }
    };

    async verifyUser(req:Request,res:Response){
       try{const params={...req.body}
          const isValidtoken = await this.authService.findTokenRecord({code: params.code})
          if(!isValidtoken){
            return utility.handleError(res, "token not found", ResponseCode.NOT_FOUND)
          }
             if(isValidtoken && moment(isValidtoken.expire).diff(moment(),'minute')>=0){
               return utility.handleError(res,"verification token expired", ResponseCode.UNAUTHORIZED_ACCESS)}
               const user = await this.authService.findUser(params.email) 
               if(!user){
               return utility.handleError(res,"user does not exist",ResponseCode.NOT_FOUND)
          }

            const updateEmailVerification = await this.authService.updateEmailVerificationRecord({id:user.id},{isEmailVerified:true})
            const updateTokenStatus =await this.authService.updateTokenRecord({id:isValidtoken.id},{status: this.authService.tokenStatus.EXPIRED}) 
          
          return utility.handleSuccess(res,'user Verified successfylly',{},ResponseCode.OK)
    } 
       catch(error){
            return utility.handleError(res,(error as TypeError).message,ResponseCode.SERVER_ERROR)
       }
    };
//scale emailing robustly with queues (Bull)
    async signupWithGoogle(req:Request,res:Response){
        try{
            //passport , users secret, credentials needed....
                
        }
        catch(error){
            return utility.handleError(res,(error as TypeError).message,ResponseCode.SERVER_ERROR)
        }
    };
};

export default AuthController;