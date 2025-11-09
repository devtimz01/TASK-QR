import 'reflect-metadata';
import express from 'express'
import { Request,Response, NextFunction} from 'express';
import Dbinitialize from './database/init'
import authRouter from './routers/auth-route'
import Taskrouter from './routers/task-route';
import maprouter from './routers/map-route';
import utility from './utils/log'
import session from 'express-session'
import passport from 'passport';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { io } from 'socket.io-client';
import userModel from './model/user-schema';
import { Iauth } from './Interface/auth-interface';
import {ExpressAdapter} from '@bull-board/express'
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { inviteQueue } from './services/queue';
import compression from 'compression'

const app= express()
app.use(express.urlencoded({extended:true}))
app.use(express.json());
//app.use(express.static('public', {maxAge:'1d'}));
app.use(compression({threshold:1024}))

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())

//bullRecord
const serverAdapter = new ExpressAdapter()
createBullBoard({
    queues: [new BullMQAdapter(inviteQueue)],
    serverAdapter
})

serverAdapter.setBasePath('/Admindashboard/inviteQueue')

//middleware
app.use('/Admindashboard/inviteQueue',serverAdapter.getRouter())
app.use('/api/auth',authRouter)
app.use('/api/task',Taskrouter)
app.use('/api',maprouter)

app.get('/',(req,res)=>{
    utility.Logger.info('oauth signup successful')
    res.send('welcome to task-Qr')
})
app.get('/oauthfailed',(req,res)=>{
    utility.Logger.error('oauth signup failed')
    res.send('signup failed, try again')
})

app.use((err:any, req:Request, res:Response, next: NextFunction)=>{
    res.status(500).json({
        status: false,
        message: err.message
    })
});

const httpServer = createServer(app)
 export const Io = new Server(httpServer,{
 });

(async()=>{
     const getAllUsers=async(): Promise<Iauth[]>=>{
   const user ={
    attributes:["id"]
   }
    return await userModel.findAll(user)
 };
let allId = await getAllUsers()
for(let i =0; i<allId.length ;i++){
    const authusers= allId[i]
    const socket = io("http://localhost:3310",{
   query:{
       userId: authusers.id 
   }
}); 
socket.on('notification',(data)=>{
    console.log("new notification",data)
});}
})();

export  let onlineUsers= new Map<string,string>()
  try{ Io.on("connection",(socket)=>{
         const userId = socket.handshake.query.userId as string
         onlineUsers.set(userId,socket.id )
               socket.on("disconnect", (error)=>{
                onlineUsers.delete(userId)
               console.log("user `${socket.id}` disconnected", error)})
           });}
           catch(error){
             utility.Logger.error((error as TypeError).message)
           };

const port = 3310;
const server = async function(){
    try{
        await Dbinitialize();
        httpServer.listen(port,()=>{
        console.log('SERVER RUNNING AT PORT 3310')
        utility.Logger.info('server running successfully')
  })
    }
    catch(error){
        console.log('server not running',error)
        utility.Logger.error('server not running')
    }
}
server();


