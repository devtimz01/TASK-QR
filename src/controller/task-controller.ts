import { Request, Response } from "express";
import utility from "../utils/log";
import { ResponseCode } from "../enums/status-code";
import { autoInjectable } from "tsyringe";
import TasKService from "../services/task-service";
import { IcollaboratorsCreationBody, InviteMessageBody, IsubtaskCreationBody, ItaskCreationBody, ItaskFolderCreationBody } from "../Interface/task-interface";
import uploadStream from "../services/cloudinary";
import AuthService from "../services/auth-service";
import MapService from "../services/Map-service";
import InviteService from "../services/invite-service";
import { inviteQueue, Io, onlineUsers } from "..";
import moment from "moment";

@autoInjectable()
class TaskController{
   public readonly defaultTime = 2
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
   async assignCollaborators(req:Request,res:Response){
       //find the nearest collaborator , invite collaborators , RBAC , cron. low-level-design
    try{
         //ask users permission for gpsAccess from FE so i test with re.headers["x-forwarded-for"]for proxy req with my server side
         const params= {...req.body}
         if(!req.user){
            throw new Error('403, error')
         }
         const findUserIp = await this.authservice.findUser({id:req.user.id})
         let currentIp= await this.authservice.findUser({id:req.user.id,ipAddress:(req.headers['x-forwarded-for'] as string)?.split(",")[0] ||req.socket.remoteAddress as string});
         if(findUserIp?.ipAddress=== null || findUserIp?.ipAddress!== currentIp?.ipAddress){
             await this.authservice.updateRecord({id:req.user.id},{ipAddress:(req.headers['x-forwarded-for'] as string)?.split(",")[0] ||req.socket.remoteAddress as string});
         }
         if(!findUserIp?.ipAddress ||!currentIp?.ipAddress){
            throw new Error('500, cannot get users Ip')
         }
          const getLongLat = await MapService.getGpsLongLat(findUserIp.ipAddress as string) 
          if(!getLongLat){
            throw new Error(' server error, cannot get users latLong')
          }
            if(!req.user){throw new Error('403 error,')}
          let nearestCollaborator = await this.mapservice.findNearestCoordinates({latitude: getLongLat.lat as number, longitude: getLongLat.long as number},req.user.id)
          if(!nearestCollaborator){
            return utility.handleError(res, 'nearest search error', ResponseCode.NOT_FOUND)
          }
          if(nearestCollaborator.id === req.user.id){
            return utility.handleError(res,"search returns current user, rerun search", ResponseCode.BAD_REQUEST)
          }
            let inviteMessage = await this.inviteservice.createInvite({
            message:`this user ${req.user.username} sent an invite to collaborate on a task`,
            status:'PENDING',
            senderId: req.user.id as string,
            receiverId: nearestCollaborator.id as string,
            expire: moment().add(params.setTime?params.setTime:this.defaultTime, 'minutes').toDate()
          }) as InviteMessageBody
          if(!inviteMessage){
            throw new Error("inviteMessage, 404")
          }
          try{
          const socketId = onlineUsers.get(nearestCollaborator.id)  as string
          if(!socketId){throw new Error('socketId not found')}
          Io.to(socketId).emit("notification",{
                  message: inviteMessage,
                  from: inviteMessage.senderId
                 });} catch(error){console.log(error)}

         if(!inviteMessage.id){throw new Error('cannot get invite message response')}
         const inviteResponse = await this.inviteservice.getMessage(inviteMessage.id) 
         if(!inviteResponse){throw new Error("invite Response 404")} 

         let collaboratorRecord;
         console.log(nearestCollaborator)

         const producer=async()=>{ 
            try{ 
             await inviteQueue.add('checkInvite',{messageId: inviteMessage.id,collaboratorSearch: nearestCollaborator, 
               defaultTime: this.defaultTime,
               setTime: params.setTime,
               user: req.user,
               longLat:getLongLat,
               taskId: params.taskId},
               {   
                  jobId: `checkinvite-${inviteMessage.id}`,
                  delay: moment(inviteMessage.expire).diff(moment(),'milliseconds'),
                  attempts: 2,
                  backoff:{type:'exponential', delay: 3000},
                  removeOnComplete: false,
                  removeOnFail: false
               } 
            )
            console.log('producer added job to queue')
         } 
            catch(error){
               utility.Logger.error('producer error,log error',error)
            }};
           await producer()

         //create pending record - update invite from queue response (invite message- ACCEPT OR DELETE)
         try{if(inviteResponse?.status==='PENDING'){
            collaboratorRecord = await this.taskService.createCollaborators({
            taskId:params.taskId,
            fullName: nearestCollaborator.fullName,
            companyName: nearestCollaborator.companyName,
            email: nearestCollaborator.email,
            username: nearestCollaborator.username,
            role :"PENDING",
          }) as IcollaboratorsCreationBody}}
          catch(error){
            console.log(error)
            return utility.handleError(res,"status pending, failed to create record", ResponseCode.BAD_REQUEST)
          }
          //RBAC permit if collab status is ACCEPT...read, create a contribution, delete
         return utility.handleSuccess(res,'collaborators record created',{collaboratorRecord}, ResponseCode.OK)
       }
      catch (error) {
          return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    };
   
   async updateInviteRequest(req:Request,res:Response){
       try{
         const params={...req.body}
         if(!req.user){
            throw new Error('403')
         }
         const getInviteMessage = await this.inviteservice.getMessage(params.messageId)
         if(!getInviteMessage){throw new Error('getInviteMessage, 404')}
          if(moment().diff(moment(getInviteMessage.expire),'minutes')>=0 ){
            return utility.handleError(res,"invite message response time expired", ResponseCode.FORBIDDEN)
         };

         const updateInviteRequest = await this.inviteservice.updateInviteStatus({id: params.messageId}, {status: params.status});
         
         const socketId = onlineUsers.get(getInviteMessage.senderId) as string
         Io.to(socketId).emit('notification',{
            message: `this user ${req.user.username} ${updateInviteRequest.status}ED your request`,
            from: getInviteMessage.receiverId
         });
         return utility.handleSuccess(res,'updateInviteResponse sent',{updateInviteRequest} ,ResponseCode.OK)
       } 
      catch (error) {
          return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
      }
   }
   async getInviteRequest(req:Request,res:Response){
       //find the nearest collaborator to you, invite collaborators , RBAC , cron. low-level-design
       try{
         const params = {...req.body}
         if(!req.user){
            throw new Error('403')
         }
         const getInviteMessage = await this.inviteservice.getMessage(params.messageId)
         if(!getInviteMessage){
            throw new Error(' cannot get inviteMessage')
         }
         return utility.handleSuccess(res,'users latlong created successfully',{getInviteMessage}, ResponseCode.OK)
       } 
      catch (error) {
         return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }
   async deleteInviteRequest(req:Request,res:Response){
       //find the nearest collaborator to you, invite collaborators , RBAC , cron. low-level-design
       try{
         const params = {...req.body}
         if(!req.user){
            throw new Error('403')
         }
         const getInviteMessage = await this.inviteservice.getMessage(params.messageId)
         if(!getInviteMessage){
            throw new Error(' cannot get inviteMessage')
         }
         await this.inviteservice.deleteMessage(getInviteMessage);
         return utility.handleSuccess(res,'users latlong created successfully',{getInviteMessage}, ResponseCode.OK)
       } 
      catch (error) {
         return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }

    async postComment(req:Request,res:Response){
       //find the nearest collaborator to you, invite collaborators , RBAC , cron. low-level-design
       try{
         const params = {...req.body}
         if(!req.user){
            throw new Error('403')
         }
         //const postComment = await this.inviteservice.getMessage({})
         //RBAC-get
         /*if(!postComment){
            throw new Error(' cannot post comment')
         }*/
        // return utility.handleSuccess(res,'users latlong created successfully',{postComment}, ResponseCode.OK)
       } 
      catch (error) {
         // return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }}
    async getComments(req:Request,res:Response){
       //find the nearest collaborator to you, invite collaborators , RBAC , cron. low-level-design
       try{
         const params = {...req.body}
         if(!req.user){
            throw new Error('403')
         }
         //const getComments = await this.inviteservice.getMessage(params.messageId)
         /*if(!getComments){
            throw new Error(' cannot get comments')
         }*/
        // return utility.handleSuccess(res,'users latlong created successfully',{getComments}, ResponseCode.OK)
       } 
      catch (error) {
         // return utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);}
    }}
    
};
//deploy...React..
export default TaskController;
