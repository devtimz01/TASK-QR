import { IsubTask, IsubtaskCreationBody, ITask, ItaskCreationBody, ItaskDataSoruce, ITaskFolder, ItaskFolderCreationBody } from "../Interface/task-interface";
import TaskFolderModel, { subTaskModel, TaskModel } from "../model/task-model";

class TaskDataSource implements ItaskDataSoruce{
   async createTaskFolder(record: ItaskFolderCreationBody): Promise<ITaskFolder> {
       return await TaskFolderModel.create(record)
   }
   async createTask(record: ItaskCreationBody):Promise<ITask>{
      return await TaskModel.create(record)
   }
   async createSubTask(record:IsubtaskCreationBody):Promise<IsubTask>{
      return await subTaskModel.create(record)
   }
};

export default TaskDataSource;