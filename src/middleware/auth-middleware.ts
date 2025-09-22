import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express';
import { xservice } from '../routers/auth-route';
import { Iauth } from '../Interface/auth-interface';
import utility from '../utils/log';
import { ResponseCode } from '../enums/status-code';
dotenv.config()

const authUser=()=>{
    return async(req:Request,res:Response, next:NextFunction)=>{
        try{
            if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
                let token = req.headers.authorization.split(" ")[1]
                const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as Iauth
                console.log(decoded)
                const user = await xservice.findUser({id:decoded.id})
                if(!user){
                    throw new Error ("user not found")
                }
                req.user = user;
                next();
            }
            else{
                throw new Error("token not found")
            }
        }
        catch(error){
        return utility.handleError(res,(error as TypeError).message,ResponseCode.SERVER_ERROR)
        }
    }
}
export default authUser;