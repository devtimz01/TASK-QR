import 'reflect-metadata';
import express from 'express'
import { Request,Response, NextFunction} from 'express';
import Dbinitialize from './database/init'
import authRouter from './routers/auth-route'
import utility from './utils/log'

const app= express()
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use('/api/auth',authRouter)

app.use((err:any, req:Request, res:Response, next: NextFunction)=>{
    res.status(500).json({
        status: false,
        message: err.message
    })
});


const port = 4033;
const Server = async function(){
    try{
        await Dbinitialize();
        app.listen(port,()=>{
        console.log('SERVER RUNNING AT PORT 4033')
        utility.Logger.info('server running successfully')
  })
    }
    catch(error){
        console.log('server not running',error)
        utility.Logger.error('server not running')
    }
}
Server();


