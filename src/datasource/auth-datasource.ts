import { Iauth, IuserCreationBody, IuserDataSource, IuserQuery } from "../Interface/auth-interface";
import userModel from "../model/user-schema";
import { FindOptions } from "sequelize";
class AuthDataSource implements IuserDataSource{
   async create(record: IuserCreationBody): Promise<Iauth> {
      return await userModel.create(record)    
    }
    async find(filter: IuserQuery): Promise<Iauth| null>{
       return await userModel.findOne(filter)
    }
    async update(data: Partial<IuserCreationBody>,sortBy: IuserQuery): Promise<void> {
        await userModel.update(data,sortBy)
    }
   async updateRecord(data: Partial<IuserCreationBody>, sortBy: IuserQuery):Promise<Iauth>{
       const [affectedCount] = await userModel.update(data, sortBy);
  if (affectedCount === 0) {
    throw new Error("No records were updated");
  }
  return data as Iauth;
   }
  async findAll(filter:FindOptions<IuserQuery>): Promise<Iauth[]> {
     return await userModel.findAll(filter)
  }
};

export default AuthDataSource;