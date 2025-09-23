import { Request, Response } from "express";
import utility from "../utils/log";
import { ResponseCode } from "../enums/status-code";
import { autoInjectable } from "tsyringe";
import TasKSerivce from "../services/task-service";
import { IsubtaskCreationBody, ItaskCreationBody, ItaskFolderCreationBody } from "../Interface/task-interface";
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
         let uploadImage:string | null= null
         if(req.file?.buffer){
            try{
                uploadImage= await uploadStream(req.file.buffer)
            }
            catch(error){
               return utility.handleError(res, (error as TypeError).message, ResponseCode.BAD_REQUEST)
            }
         }
            const taskFolder = await this.taskService.createTaskFolder({
               taskFolderName:params.taskFolderName,
               image: uploadImage as string,
               status:'PENDING'
            }) as ItaskFolderCreationBody
            return utility.handleSuccess(res,'TaskFolder created successfully',{taskFolder}, ResponseCode.OK)
       }
      catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
          return utility.handleError(res, errorMessage, ResponseCode.SERVER_ERROR);
   }
    };

    async createTask(req:Request,res:Response){
       try{
         const params ={...req.body}
         let uploadFile:string | null= null
         if(req.file?.buffer){
            try{
                uploadFile= await uploadStream(req.file.buffer)
            }
            catch(error){
               return utility.handleError(res, (error as TypeError).message, ResponseCode.BAD_REQUEST)
            }
         }
            const task = await this.taskService.createTask({
               taskName: params.taskName,
               dependencies: params.dependencies,
               dueDate: params.dueDate,
               files: uploadFile as string,
               description: params.description,
               folderId: params.folderId,
               markAsComplete: false,
               notifications: params.notifications,
               comments: params.comments
            }) as ItaskCreationBody
            return utility.handleSuccess(res,'Task created successfully',{task}, ResponseCode.OK)
       }catch(error:unknown){
         const handleError =  error instanceof Error? error.message: "failed creating task"
         console.error(error)
        return utility.handleError(res,handleError,ResponseCode.SERVER_ERROR)
       }
    };

    async createSubTask(req:Request,res:Response){
       try{
         const params ={...req.body}
         let uploadFile: string | null= null
          if(req.file?.buffer){
            try{
             uploadFile = await uploadStream(req.file.buffer)
             console.log(uploadFile)
            }   
             catch(error){
               console.log(error)
               throw new Error('file upload failed')
            }
         }
            const subTask = await this.taskService.createSubTask({
               taskName: params.taskName,
               dependencies: params.dependencies,
               dueDate: params.dueDate,
               files: uploadFile as string,
               description: params.description,
               TaskId: params.TaskId,
               markAsComplete: false,
               notifications: params.notifications,
               comments: params.comments
            }) as IsubtaskCreationBody
            return utility.handleSuccess(res,'Task created successfully',{subTask}, ResponseCode.OK)
       }catch(error){
        return utility.handleError(res,(error as TypeError).message,ResponseCode.SERVER_ERROR)
       }
    };

    async assignCollaborators(req:Request,res:Response){
       //find the nearest collaborator to you, invite collaborators , RBAC , cron. low-level-design
       try{
         const params ={...req.body}
         //update users address and store it..id: req.user.id, adddress: params.address, long lat


          return utility.handleSuccess(res,'TaskFolder created successfully',{}, ResponseCode.OK)
       }
      catch (error) {
          return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }
};

export default TaskController;
