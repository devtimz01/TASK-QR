import { injectable } from "tsyringe";
import { IsubTask,ITask,ITaskFolder, IsubtaskCreationBody, ItaskFolderCreationBody, ItaskCreationBody } from "../Interface/task-interface";
import TaskDataSource from "../datasource/task-datasource";

@injectable()
class TasKSerivce{
    public taskDataSource: TaskDataSource
    constructor(_taskDataSource: TaskDataSource){
        this.taskDataSource= _taskDataSource
    }
    
async createTaskFolder(record: ItaskFolderCreationBody):Promise<ITaskFolder>{
         return await this.taskDataSource.createTaskFolder(record)
};
async createTask(record: ItaskCreationBody):Promise<ITask>{
         return await this.taskDataSource.createTask(record)
    };
async createSubTask(record: IsubtaskCreationBody):Promise<IsubTask>{
         return await this.taskDataSource.createSubTask(record)
    };

public static async assignTaskByGeolocation(){

};


};

export default TasKSerivce;