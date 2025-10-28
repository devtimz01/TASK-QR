import 'reflect-metadata'
import { Worker } from "bullmq";
import { container } from "tsyringe";
import InviteService from "./invite-service";
import moment from "moment";
import MapService from "./Map-service";
import { InviteMessageBody } from "../Interface/task-interface";
import {  Io } from "..";
import { inviteQueue } from './queue';
import { onlineUsers } from "..";
import TasKSerivce from "./task-service";
import { IcollaboratorsCreationBody } from "../Interface/task-interface";

const inviteSerivce = container.resolve(InviteService)
const mapservice = container.resolve(MapService)
const taskservice = container.resolve(TasKSerivce)
function runWorker(){
const process = new Worker('checkInvite', async(job)=>{
            let inviteMessage; let nearestCollaborator;
            let {messageId,collaboratorSearch,user,longLat,defaultTime,setTime,taskId} = job.data
            const invite = await inviteSerivce.getMessage(messageId) 
            if(!invite)return; 
            console.log("job accepted",job.data)

            //check expiry
            if(moment().diff(moment(invite.expire),'minute')>=0 && invite.status ==='PENDING'){
            await inviteSerivce.updateInviteStatus({id:invite.id},{status: 'EXPIRED'})
             
            if(!user){throw new Error('403 error,')}
            nearestCollaborator = await mapservice.findNearestCoordinates({latitude: longLat.lat as number, longitude: longLat.long as number}, user.id)
          if(!nearestCollaborator){
            throw new Error('cannot get nearestCollaborator, 404')
          }
            inviteMessage= await inviteSerivce.createInvite({
            message:`this user ${user.username} sent an invite to collaborate on a task`,
            status:'PENDING',
            senderId: user.id as string,
            receiverId: nearestCollaborator.id as string,
            expire: moment().add(setTime?setTime:defaultTime).toDate() 
          }) as InviteMessageBody
          if(!inviteMessage){
            throw new Error("inviteMessage, 404")
          }
          const socketId = onlineUsers.get(nearestCollaborator.id)  as string
          if(!socketId){throw new Error('socketId not found')}
          Io.to(socketId).emit("notification",{
                  message: inviteMessage,
                  from: inviteMessage.senderId
                 })
          inviteQueue.add('checkInvite', {messageId: inviteMessage.id  ,collaboratorSearch :nearestCollaborator ,user,longLat,defaultTime,setTime,taskId},{
            jobId: `checknewinvite-${inviteMessage.id}`, 
            delay: moment(inviteMessage.expire).diff(moment(),'milliseconds'),
                             attempts: 2,
                             backoff:{type:'exponential', delay: 3000},
                             removeOnComplete: false,
                             removeOnFail: false
        })
           //now process collabrecord from newInvite.response, new collabSearch
               try{ if(inviteMessage.status==='DELETE'){
                await inviteSerivce.deleteMessage({id: inviteMessage.id})
                return;
                }}
                catch(error){ throw new Error('error deleting new invite record after user DECLINED')}
              
                try{if(inviteMessage.status==='ACCEPT'){
                   await taskservice.createCollaborators({
                     taskId:taskId,
                     fullName: nearestCollaborator.fullName,
                     companyName: nearestCollaborator.companyName,
                     email: nearestCollaborator.email,
                     username: nearestCollaborator.username,
                     role :"ASSIGNEE",
                 }) as IcollaboratorsCreationBody}
                  await inviteSerivce.deleteMessage({id: inviteMessage.id})
                  return;
                }
                catch(error){
                  console.log(error)
                }
      };    
            //invite message still valid? proceed 
             if(invite.status==='DELETE'){
             await inviteSerivce.deleteMessage({id: invite.id})
             return;
         }
            try{if(invite.status==='ACCEPT'){
            await taskservice.createCollaborators({
            taskId:taskId,
            fullName: collaboratorSearch.fullName,
            companyName: collaboratorSearch.companyName,
            email: collaboratorSearch.email,
            username: collaboratorSearch.username,
            role :"ASSIGNEE",
          }) as IcollaboratorsCreationBody}
           await inviteSerivce.deleteMessage({id: invite.id})
            return;}
          catch(error){
            console.log(error)}
          },{connection:{
             host:'127.0.0.1' as string,
             port: 6379 as number
         }});

         process.on('completed',(job)=>{
            console.log('job completed', job.id)
         })
         process.on('failed',(job,err)=>{
            console.log('worker process job failed', err.message)
         })
        };

      /* if (process.argv[1].includes('workers')) {
          runWorker();}*/
