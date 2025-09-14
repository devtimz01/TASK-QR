import { Request, Response } from "express";
import utility from "../utils/log";
import { ResponseCode } from "../enums/status-code";
import { autoInjectable } from "tsyringe";

@autoInjectable()
class TaskController{
    async createTask(req:Request,res:Response){
       try{
         const params ={...req.body}
            
       }catch(error){
        return utility.handleError(res,(error as TypeError).message,ResponseCode.SERVER_ERROR)
       }
    };
    
};

export default TaskController;
