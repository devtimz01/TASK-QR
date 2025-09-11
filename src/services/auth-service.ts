import { Iauth, IuserCreationBody, IuserQuery } from "../Interface/auth-interface";
import AuthDataSource from "../datasource/auth-datasource";
import { injectable} from 'tsyringe'
import nodemailer from 'nodemailer'
import utility from "../utils/log";
import { Itoken, ItokenCreationBody, ItokenQuery } from "../Interface/Token-interface";
import crypto from 'crypto'
import TokenDataSource from "../datasource/token-dataource";
import moment from "moment";

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

   async findTokenRecord(code: Partial<ItokenCreationBody>):Promise<Itoken | null>{
     const query={
        where:{...code},
        raw: true
     } as ItokenQuery
     return await this.tokenDataSource.find(query)
   }

   async generateToken(record: ItokenCreationBody){
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
         }
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
};

export default AuthService;