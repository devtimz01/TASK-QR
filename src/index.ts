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

//routes
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
 export const io = new Server(httpServer,{
 })
  try{ io.on("connection",(socket)=>{
               socket.on("disconnect", (error)=>{
               console.log("user `${socket.id}` disconnected", error)})
           });}
           catch(error){
             utility.Logger.error((error as TypeError).message)
           };

const port = 4035;
const server = async function(){
    try{
        await Dbinitialize();
        httpServer.listen(port,()=>{
        console.log('SERVER RUNNING AT PORT 4035')
        utility.Logger.info('server running successfully')
  })
    }
    catch(error){
        console.log('server not running',error)
        utility.Logger.error('server not running')
    }
}
server();


