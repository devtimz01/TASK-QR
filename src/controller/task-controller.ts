import { Request, Response } from "express";
import utility from "../utils/log";
import { ResponseCode } from "../enums/status-code";
import { autoInjectable } from "tsyringe";
import TasKSerivce from "../services/task-service";
import { IsubtaskCreationBody, ItaskCreationBody, ItaskFolderCreationBody } from "../Interface/task-interface";
import uploadStream from "../services/cloudinary";
import AuthService from "../services/auth-service";
import MapService from "../services/Map-service";

@autoInjectable()
class TaskController{
   public taskService: TasKSerivce
   public authservice: AuthService
   public mapservice: MapService
   constructor(_taskService: TasKSerivce, _authservice:AuthService, _mapService: MapService){
      this.taskService= _taskService
      this.authservice =_authservice
      this.mapservice =_mapService
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
         //req.socket.remoteadress req.headers.['x-forwarded-for']
         //ask users permission for gpsAccess from FE
         const findUserIp = await this.authservice.findUser({id:params.req.user.id})
             if(!findUserIp){
                throw new Error(' server error cannot find users Ip record')}
          let currentIp= await this.authservice.findUser({id:params.req.user.id,ipAddress:req.headers['x-forwarded-for'] as any});
             if(!currentIp){
             throw new Error(' server error cannot find users current Ip record')}
         if(findUserIp?.ipAddress=='NULL' || findUserIp!= currentIp){
             await this.authservice.updateRecord({id:params.req.user.id},{ipAddress:req.headers['x-forwarded-for']} as any);
         }
          const getLongLat = await MapService.getGpsLongLat(findUserIp?.ipAddress) 
          if(!getLongLat){
            throw new Error(' server error, cannot get users latLong')
          }
          //calculate proximity accurate coordinates with latlong float not more than specified distance
          let findNearestCollaborator = await this.mapservice.findNearestCoordinates({latitude: getLongLat.lat, longitude: getLongLat.long})
          if(!findNearestCollaborator){
            return utility.handleError(res, 'nearest search error', ResponseCode.NOT_FOUND)
          }   
          return utility.handleSuccess(res,'TaskFolder created successfully',{findNearestCollaborator}, ResponseCode.OK)
       }
      catch (error) {
          return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }
     async getUsersLongLat(req:Request,res:Response){
       //find the nearest collaborator to you, invite collaborators , RBAC , cron. low-level-design
       try{
         const params ={...req.body}
          let getIpAddress= await this.authservice.updateRecord({id:params.req.user.id},{ipAddress:req.headers['x-forwarded-for']} as any);
          const getLongLat = await MapService.getGpsLongLat(getIpAddress.ipAddress)
          const usersLongLat = await this.authservice.updateRecord({id: params.req.user},{latitude: getLongLat.lat, longitude: getLongLat.long})
          return utility.handleSuccess(res,'TaskFolder created successfully',{usersLongLat}, ResponseCode.OK)
       }
      catch (error) {
          return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }
};

export default TaskController;
