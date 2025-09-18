import TaskFolderModel from "../model/task-model"
import tokenModel from "../model/token-schema"
import userModel from "../model/user-schema"
import utility from "../utils/log"
import Db from './index'

const Dbinitialize=async()=>{
   try{
     userModel.sync({alter:false})
     tokenModel.sync({alter:false})
     TaskFolderModel.sync({alter:true})
     await Db.authenticate()
   }
   catch(err){
    console.log(err)
    utility.Logger.error('Database modelsync authentication error')
   }
}
export default Dbinitialize;

//optimize your queries by sharding, indexing ....