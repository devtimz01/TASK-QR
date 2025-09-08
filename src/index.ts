import 'reflect-metadata';
import express from 'express'
import { Request,Response, NextFunction} from 'express';
import Dbinitialize from './database/init'
import authRouter from './routers/auth-route'
import utility from './utils/log'

const app= express()
const port = 3000
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use((err:any, req:Request, res:Response, next:NextFunction)=>{
    res.status(500).json({
        status: false,
        message: err.message
    })
});

app.use('/api/auth', authRouter)

const Server = async function(){
    //mount my Dbinitialize
    await Dbinitialize
    try{
        app.listen(port,()=>{
        console.log('server running at port 3000')
        utility.Logger.info('server running successfully')
  })
    }
    catch(err){
        console.log('server not running',err)
        utility.Logger.error('server not running')
        process.exit(1)
    }
}
Server();