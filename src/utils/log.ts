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
        }),
        new transports.Console()
    ],
    format: format.combine(format.timestamp({format: 'YYYY-DD-MM, HH:mm:ss'}), format.printf((info)=>
            `${info.timestamp} ${info.level}:${info.message}`))
})

const handleSuccess=(res:Response, message: string, data={}, statusCode: number=200)=>{
    Logger.log({level:'info',message})
    return res.status(statusCode).json({status:true,message,data:{...data}})
}

const handleError=(res:Response, message: string, statusCode: number=400)=>{
      Logger.log({level:'error',message})
    return res.status(statusCode).json({status:false,message})
}

function getPublicIp(ip?: string | null): string | null {
  if (!ip) return null;

  // Normalize IPv6 localhost
  if (ip === "::1") return null;

  // Remove IPv6 prefix "::ffff:"
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  // Exclude private ranges
  const privatePatterns = [
    /^10\./,
    /^127\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2\d|3[0-1])\./
  ];

  if (privatePatterns.some((pat) => pat.test(ip))) {
    return null;
  }

  return ip;
}


const utility={
    handleError,
    handleSuccess,
    Logger,
    getPublicIp
};

export default utility;