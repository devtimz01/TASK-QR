import express, { Request, Response } from 'express'
import { container } from 'tsyringe'
import TaskController from '../controller/task-controller'
import authUser from '../middleware/auth-middleware'
const maprouter = express.Router()
const controller = container.resolve(TaskController)

maprouter.patch('/createuserslatlong',authUser(),(req:Request, res: Response)=>{
    return controller.getUsersLongLat(req,res)
})
maprouter.get('/assigncollaborators',authUser() ,(req:Request, res: Response)=>{
    return controller.assignCollaborators(req,res)
})

export default maprouter;