import inviteModel from "../model/invite-msg-model"
import TaskFolderModel, { collaboratorsModel, subTaskModel, TaskModel } from "../model/task-model"
import tokenModel from "../model/token-schema"
import userModel from "../model/user-schema"
import utility from "../utils/log"
import Db from './index'

const Dbinitialize=async()=>{
   try{
     userModel.sync({alter:false})
     tokenModel.sync({alter:false})
     TaskFolderModel.sync({alter:false})
     TaskModel.sync({alter:false})
     subTaskModel.sync({alter:false})
     inviteModel.sync({alter:false})
     collaboratorsModel.sync({alter:false})
     await Db.authenticate()
   }
   catch(err){
    console.log(err)
    utility.Logger.error('Database modelsync authentication error')
   }
}
export default Dbinitialize;

//optimize your queries by sharding, indexing ....