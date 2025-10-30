import { container} from 'tsyringe'
import express, { Request, Response } from 'express'
import TaskController from '../controller/task-controller'
import { validator } from '../middleware/index.validator'
import {authUser} from '../middleware/auth-middleware'
import { upload } from '../services/cloudinary'
import { inviteResponse, subTaskTemplate, TaskFolderTemplate, taskTemplate } from '../validators/task-validation-schema'

const Taskrouter = express.Router()
const taskController = container.resolve(TaskController)

Taskrouter.post('/taskfolder',authUser(),upload.single("image"),validator(TaskFolderTemplate) ,(req:Request,res:Response)=>{
    return taskController.createTaskFolder(req,res)
});
Taskrouter.post('/task',authUser(),upload.single('file'),validator(taskTemplate),(req:Request,res:Response)=>{
    return taskController.createTask(req,res)
});
Taskrouter.post('/subtask',authUser(),upload.single("files"), validator(subTaskTemplate), (req:Request,res:Response)=>{
    return taskController.createSubTask(req,res)
});
Taskrouter.post('/assigncollaborator', authUser(),(req:Request,res:Response)=>{
    return taskController.assignCollaborators(req,res)})

Taskrouter.patch('/replyinvitemessage', authUser(),validator(inviteResponse) ,(req:Request,res:Response)=>{
    return taskController.updateInviteRequest(req,res)})
    
Taskrouter.delete('/deleteinvitejob',(req:Request,res:Response)=>{
    return taskController.deleteInviteRequest(req,res)})

export default Taskrouter;