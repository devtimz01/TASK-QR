import { injectable } from "tsyringe";
import { IsubTask,ITask,ITaskFolder, IsubtaskCreationBody, ItaskFolderCreationBody, ItaskCreationBody, IcollaboratorsCreationBody, Icollaborators } from "../Interface/task-interface";
import TaskDataSource from "../datasource/task-datasource";
import CollabDataSource from "../datasource/collab-ds";

@injectable()
class TasKSerivce{
    public taskDataSource: TaskDataSource
    public collabDataSource: CollabDataSource
    constructor(_taskDataSource: TaskDataSource,_collabDataSource: CollabDataSource){
        this.taskDataSource= _taskDataSource
        this.collabDataSource = _collabDataSource
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
async createCollaborators(record: IcollaboratorsCreationBody): Promise<Icollaborators>{
    return await this.collabDataSource.createCollaborator(record)
}

};

export default TasKSerivce;