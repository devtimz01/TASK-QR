import { container} from 'tsyringe'
import express, { Request, Response } from 'express'
import TaskController from '../controller/task-controller'
import multer from 'multer'
import { validator } from '../middleware/index.validator'
import authUser from '../middleware/auth-middleware'
import { inviteResponse, subTaskTemplate, TaskFolderTemplate, taskTemplate } from '../validators/task-validation-schema'

const storage = multer.memoryStorage()
const Mutter = multer({storage});
const Taskrouter = express.Router()
const taskController = container.resolve(TaskController)

Taskrouter.post('/taskfolder',authUser(),Mutter.single("image"),validator(TaskFolderTemplate) ,(req:Request,res:Response)=>{
    return taskController.createTaskFolder(req,res)
});
Taskrouter.post('/task',authUser(),Mutter.single("file"),validator(taskTemplate),(req:Request,res:Response)=>{
    return taskController.createTask(req,res)
});
Taskrouter.post('/subtask',authUser(),Mutter.single("files"), validator(subTaskTemplate), (req:Request,res:Response)=>{
    return taskController.createSubTask(req,res)
});
Taskrouter.post('/assigncollaborator', authUser(),(req:Request,res:Response)=>{
    return taskController.assignCollaborators(req,res)})

Taskrouter.patch('/replyinvitemessage', authUser(),validator(inviteResponse) ,(req:Request,res:Response)=>{
    return taskController.updateInviteRequest(req,res)})
    
Taskrouter.delete('/deleteinvitejob',(req:Request,res:Response)=>{
    return taskController.deleteInviteRequest(req,res)})

export default Taskrouter;