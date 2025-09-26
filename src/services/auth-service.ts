import { Iauth, IuserCreationBody, IuserQuery } from "../Interface/auth-interface";
import AuthDataSource from "../datasource/auth-datasource";
import { injectable} from 'tsyringe'
import nodemailer from 'nodemailer'
import utility from "../utils/log";
import { Itoken, ItokenCreationBody, ItokenQuery } from "../Interface/Token-interface";
import crypto from 'crypto'
import TokenDataSource from "../datasource/token-dataource";
import moment from "moment";
import dotenv from 'dotenv'
dotenv.config();

@injectable()
class AuthService{
    private authDataSource: AuthDataSource
    private tokenDataSource: TokenDataSource
    constructor(_authData: AuthDataSource, _tokenDataSource:TokenDataSource){
        this.authDataSource =_authData
        this.tokenDataSource =_tokenDataSource
    }
   async createUser(record: IuserCreationBody): Promise<Iauth>{
     return await this.authDataSource.create(record)
}
   async findUser(record:Partial<Iauth>): Promise<Iauth | null>{
    const query={
        where:{...record},
        raw:true
    } as IuserQuery
    return await this.authDataSource.find(query)
   }

   async updateUserRecord(record: Partial<Iauth>, data:Partial<Iauth>){
       const sortBy ={
        where:{...record},
        raw:true
       } as IuserQuery
       await this.authDataSource.update(data,sortBy)
   };
   async updateRecord(record:Partial<Iauth>, data: Partial<Iauth>){
       const sortBy ={
        where:{...record},
        raw:true
       } as IuserQuery
      return await this.authDataSource.updateRecord(data,sortBy)
   }
    public readonly completeVerification={
      PENDING: 'PENDING'
   }
   public readonly password={
    NULL:'NULL'
   }
   async signUpwithGoogle(record: Partial<IuserCreationBody>):Promise<Iauth>{
    const data={
      ...record,
      password: this.password.NULL,
      companyName:this.completeVerification.PENDING,
      fullName: this.completeVerification.PENDING
    } as IuserCreationBody
    return await this.authDataSource.create(data)
   };
   
   public static async sendMail(userEmail: string,token: Partial<Itoken>){
      const Transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.ADMIN_MAIL as string,
            pass: process.env.ADMIN_PASS as string
        }
      });
      Transporter.verify((error)=>{
        if(error){
             utility.Logger.error('Tranporter error')
             throw new Error('Transporter error')
        }
        else{
            utility.Logger.info('Transporter active')
        }
      });
     const info = Transporter.sendMail({
        from: process.env.ADMIN_MAIL,
        to:userEmail,
        subject:'verification email',
        html:`confirm this email is yours <a href="http://localhost:4033/api/auth/verify?token=${token}">CLICK HERE<a/>`
     });
      return info;
   };

   async findTokenRecord(code: Partial<ItokenCreationBody>):Promise<Itoken | null>{
     const query={
        where:{...code},
        raw: true
     } as ItokenQuery
     return await this.tokenDataSource.find(query)
   }

   async generateToken(record: ItokenCreationBody):Promise<Itoken>{
    try{
        const tokenData={...record}
        let isValidToken = false
         while(!isValidToken){
            const generateCode=():string=>{
                const code = crypto.randomBytes(32).toString('hex')
                return code;
            }
            let tokenCode= generateCode()
            let data = await this.findTokenRecord({code:tokenCode})
            if(!data){
                isValidToken= true
                break;
            }
         };
        return await this.tokenDataSource.create(tokenData)
    }
    catch(err){
        utility.Logger.error('failed to generate verification token code')
        throw new Error("could not generate valid token code")
    }
   };

   public tokenStatus={
       EXPIRED: 'EXPIRED',
       VALID: 'VALID'
   };
   private readonly tokenExpires: number = 5

   async createTokenRecord(email: string):Promise<Itoken>{
      try{
        const tokenRecord ={
            key: email,
            status: this.tokenStatus.VALID,
            expire: moment().add(this.tokenExpires, 'minutes').toDate()
        } as ItokenCreationBody

        const token = await this.generateToken(tokenRecord)
        return token;
      }
      catch(err){
        utility.Logger.error("failed to generate token record")
        throw new Error('failed to generate token')
      }
   }
   
   async updateTokenRecord(sortBy:Partial<Itoken>,data:Partial<Itoken>):Promise<void>{
      const query ={
        where:{...sortBy}, raw:true
      } as ItokenQuery
      await this.tokenDataSource.update(data, query)
   }
};

export default AuthService;