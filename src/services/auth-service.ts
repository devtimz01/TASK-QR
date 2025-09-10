import { Iauth, IuserCreationBody, IuserQuery } from "../Interface/auth-interface";
import AuthDataSource from "../datasource/auth-datasource";
import { injectable} from 'tsyringe'
import nodemailer from 'nodemailer'
import utility from "../utils/log";
import { where } from "sequelize";
import { Itoken, ItokenCreationBody } from "../Interface/Token-interface";

@injectable()
class AuthService{
    private authDataSource: AuthDataSource
    constructor(_authData: AuthDataSource){
        this.authDataSource =_authData
    }
   async createUser(record: IuserCreationBody): Promise<Iauth>{
     return await this.authDataSource.create(record)
}
   async findUser(record:Partial<IuserCreationBody>): Promise<Iauth | null>{
    const query={
        where:{...record},
        raw:true
    } as IuserQuery
    return await this.authDataSource.find(query)
   }

   public static async sendMail(userEmail: string){
      const Transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.ADMIN as string,
            pass: process.env.PASS as string
        }
      });
      Transporter.verify((error,success)=>{
        if(error){
             utility.Logger.error('Tranporter error')
             throw new Error('Transporter error')
        }
        else{
            utility.Logger.info('Transporter active')
        }
      });
     const info = Transporter.sendMail({
        from: process.env.ADMIN,
        to:userEmail,
        subject:'verification email',
        html:"<p>confirm this email is yours click here, `` <p/>"
     })
      return info;
   };

   async generateToken(){
    try{
    let isValidToken = false
         while(!isValidToken){

         }
    }
    catch(err){

    }
   }

   async createTokenRecord(record: Partial<ItokenCreationBody>):Promise<Itoken>{
      const tokenRecord={
        
      } as ItokenCreationBody
   }
};

export default AuthService;