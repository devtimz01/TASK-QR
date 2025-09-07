import { Iauth, IuserCreationBody, IuserDataSource, IuserQuery } from "../Interface/auth-interface";
import userModel from "../model/user-schema";

class AuthDataSource implements IuserDataSource{
   async create(record: IuserCreationBody): Promise<Iauth> {
      return await userModel.create(record)    
    }
    async find(filter: IuserQuery): Promise<Iauth| null>{
       return await userModel.findOne(filter)
    }
}

export default AuthDataSource;