import 'reflect-metadata';
//import './services/workers'
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
import { Queue } from 'bullmq';


const app= express()
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())

//bullRecord
export const inviteQueue= new Queue('checkInvite',{connection:{
             host:'127.0.0.1' as string,
             port: 6379 as number
         }});

(async () => {
  try {
    // Test low-level connection
    const client = await inviteQueue.client;
    console.log('✅ Redis connected:', client.status);

  } catch (err) {
    console.error('❌ Redis connection or queue error:', err);
  }
})();

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
    const socket = io("http://localhost:4010",{
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

const port = 4010;
const server = async function(){
    try{
        await Dbinitialize();
        httpServer.listen(port,()=>{
        console.log('SERVER RUNNING AT PORT 4010')
        utility.Logger.info('server running successfully')
  })
    }
    catch(error){
        console.log('server not running',error)
        utility.Logger.error('server not running')
    }
}
server();


