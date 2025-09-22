import { NextFunction } from "express";
import { Schema } from "yup";
import { Response,Request } from "express";
import utility from "../utils/log";
import { ResponseCode } from "../enums/status-code";

export const validator=(schema:Schema<any>)=>{
    return async (req:Request,res:Response, next:NextFunction)=>{
       try{ await schema.validate(req.body,{abortEarly:true})
        next();}
        catch(error:any){
            return utility.handleError(res,error.errors[0],ResponseCode.BAD_REQUEST)
        }
    }
};

