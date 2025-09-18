import { Request, Response } from "express";
import utility from "../utils/log";
import { ResponseCode } from "../enums/status-code";
import { autoInjectable } from "tsyringe";
import TasKSerivce from "../services/task-service";
import { ItaskFolderCreationBody } from "../Interface/task-interface";
import uploadStream from "../services/cloudinary";

@autoInjectable()
class TaskController{
   public taskService: TasKSerivce
   constructor(_taskService: TasKSerivce){
      this.taskService= _taskService
   }
    async createTaskFolder(req:Request,res:Response){
       try{
         const params ={...req.body}
         const uploadImage= uploadStream(params.image)
            const taskFolder = await this.taskService.createTaskFolder({
               taskFolderName:params.taskFolderName,
               image: uploadImage,
               status:'PENDING'
            }) as ItaskFolderCreationBody
            return utility.handleSuccess(res,'TaskFolder created successfully',{taskFolder}, ResponseCode.OK)
       }catch(error){
        return utility.handleError(res,(error as TypeError).message,ResponseCode.SERVER_ERROR)
       }
    };
    
};

export default TaskController;
