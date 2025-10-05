import { Request, Response } from "express";
import utility from "../utils/log";
import { ResponseCode } from "../enums/status-code";
import { autoInjectable } from "tsyringe";
import TasKService from "../services/task-service";
import { InviteMessageBody, IsubtaskCreationBody, ItaskCreationBody, ItaskFolderCreationBody } from "../Interface/task-interface";
import uploadStream from "../services/cloudinary";
import AuthService from "../services/auth-service";
import MapService from "../services/Map-service";
import InviteService from "../services/invite-service";
import { io } from "..";

@autoInjectable()
class TaskController{
   public taskService: TasKService
   public authservice: AuthService
   public mapservice: MapService
   public inviteservice: InviteService
   constructor(_taskService: TasKService, _authservice:AuthService, _mapService: MapService, _inviteservice: InviteService){
      this.taskService= _taskService
      this.authservice =_authservice
      this.mapservice =_mapService
      this.inviteservice = _inviteservice
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
         //ask users permission for gpsAccess from FE so i test with re.headers["x-forwarded-for"]for proxy req with my server side
         if(!req.user){
            throw new Error('403, error')
         }
         const findUserIp = await this.authservice.findUser({id:req.user.id})
         let currentIp= await this.authservice.findUser({id:req.user.id,ipAddress:(req.headers['x-forwarded-for'] as string)?.split(",")[0] ||req.socket.remoteAddress as string});
         if(findUserIp?.ipAddress=='NULL' || findUserIp?.ipAddress!== currentIp?.ipAddress){
             await this.authservice.updateRecord({id:req.user.id},{ipAddress:(req.headers['x-forwarded-for'] as string)?.split(",")[0] ||req.socket.remoteAddress as string});
         }
         if(!findUserIp?.ipAddress ||!currentIp?.ipAddress){
            throw new Error('500, cannot get users Ip')
         }
          const getLongLat = await MapService.getGpsLongLat(findUserIp.ipAddress as string) 
          if(!getLongLat){
            throw new Error(' server error, cannot get users latLong')
          }
          //calculate proximity accurate coordinates with latlong float not more than specified distance
          let nearestCollaborator = await this.mapservice.findNearestCoordinates({latitude: getLongLat.lat as number, longitude: getLongLat.long as number})
          if(!nearestCollaborator){
            return utility.handleError(res, 'nearest search error', ResponseCode.NOT_FOUND)
          }
           let inviteMessage = await this.inviteservice.createInvite({
            message:" this user `${req.user.username}` sent an invite to collaborate on a task",
            status:'PENDING'
          })  as InviteMessageBody
          if(!inviteMessage){
            throw new Error("inviteMessage, 404")
          }
           io.on("connection",(socket)=>{
              socket.on("disconnect", (error)=>{
              console.log("user `${socket.id}` disconnected", error)})
              socket.on("sendNotification",(nearestCollaborator: string, inviteMessage:InviteMessageBody)=>{
                 io.to(nearestCollaborator).emit("notification",{
                  message: inviteMessage,
                  from: inviteMessage.senderId
                 })
              })
          });
           console.log('SOCKET.IO SERVER IS ACTIVE')
          //if(inviteMessage.status.moment.add()==='PENDING'){}
          //get inviteMessage, ACcept or decline update, permission to update or create once.
          //send Update req.
          //cron for request pending over an hour
          //return utility.handleSuccess(res,'proximity search successful',{result}, ResponseCode.OK)
       }
      catch (error) {
          return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }
    async getInviteRequest(req:Request,res:Response){
       //find the nearest collaborator to you, invite collaborators , RBAC , cron. low-level-design
       try{
         if(!req.user){
            throw new Error('403')
         }
        
         // return utility.handleSuccess(res,'users latlong created successfully',{usersLongLat}, ResponseCode.OK)
       } 
      catch (error) {
         // return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
      }}
    async updateInviteRequest(req:Request,res:Response){
       //find the nearest collaborator to you, invite collaborators , RBAC , cron. low-level-design
       try{
         if(!req.user){
            throw new Error('403')
         }
        
         // return utility.handleSuccess(res,'users latlong created successfully',{usersLongLat}, ResponseCode.OK)
       } 
      catch (error) {
         // return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }}
    async getUsersLongLat(req:Request,res:Response){
       //find the nearest collaborator to you, invite collaborators , RBAC , cron. low-level-design
       try{
         if(!req.user){
            throw new Error('403')
         }
         const findUserIp = await this.authservice.findUser({id:req.user.id})
         let currentIp= await this.authservice.findUser({id:req.user.id,ipAddress:(req.headers['x-forwarded-for'] as string)?.split(",")[0] ||req.socket.remoteAddress as string});
         if(findUserIp?.ipAddress=='NULL' || findUserIp?.ipAddress!==currentIp?.ipAddress){
             await this.authservice.updateRecord({id:req.user.id},{ipAddress:(req.headers['x-forwarded-for'] as string)?.split(",")[0] ||req.socket.remoteAddress as string});
         }
         if(!findUserIp?.ipAddress && !currentIp?.ipAddress){
            throw new Error('500, cannot get users ip')
         }
          const getLongLat = await MapService.getGpsLongLat(findUserIp?.ipAddress as string)
          if(!getLongLat){
            throw new Error('404, cannot get users longat')
          }
          const usersLongLat = await this.authservice.updateRecord({id: req.user.id},{latitude: getLongLat.lat, longitude: getLongLat.long})
          console.log(usersLongLat)
          return utility.handleSuccess(res,'users latlong created successfully',{usersLongLat}, ResponseCode.OK)
       } 
      catch (error) {
         console.log(error)
          return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }
};
//deploy... React..
export default TaskController;
