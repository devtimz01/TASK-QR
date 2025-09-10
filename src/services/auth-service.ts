import { Iauth, IuserCreationBody, IuserQuery } from "../Interface/auth-interface";
import AuthDataSource from "../datasource/auth-datasource";
import {autoInjectable, injectable} from 'tsyringe'

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
}



export default AuthService;