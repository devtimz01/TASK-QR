import {format,transports,createLogger, level} from 'winston'
import {Response} from 'express'

const Logger = createLogger({
    transports:[
        new transports.File({
            filename: './logs/index.logs',
            level: 'error'
        }),
        new transports.File({
            filename: './logs/info.logs',
            level: 'info'
        })
    ],
    format: format.combine(format.timestamp({format: 'YYYY-DD-MM, HH:mm:ss'}), format.printf((info)=>
            `${info.timestamp} ${info.level}:${info.message}`))
})

const handleSuccess=(res:Response, message: string, data: {}, statusCode: number=200)=>{
    Logger.log({level:'info',message})
    return res.status(statusCode).json({status:true,message,data:{...data}})
}

const handleError=(res:Response, message: string, statusCode: number=400)=>{
      Logger.log({level:'error',message})
    return res.status(statusCode).json({status:false,message})
}

const utility={
    handleError,
    handleSuccess,
    Logger
};

export default utility;