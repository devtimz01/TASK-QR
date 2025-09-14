import { Model, Optional } from "sequelize";

export interface ITask{
    id:string;
    taskName: string;
    dependencies: string
    files: string;
    description:string;
    subtasks:[key:ITask]
    collaborators:string;
    dueDate: Date;
    markAsComplete: boolean;
    notifications: string;
    comments: string;
    createdAt:string;
    updatedAt:string;
};

export interface ITaskFolder{
    id:string;
    image: string;
    taskFolderName: string
    tasks: [key:ITask];
    status:string;
    overdue: Date;
    completed: Date;
    createdAt: string;
    updatedAt:string
};

export interface ItaskCreationBody extends Optional<ITask, 'id'|'createdAt'|'updatedAt'>{}
export interface ItaskModel extends Model <ITask,ItaskCreationBody>,ITask{}
export interface ItaskDataSoruce{
    create(record: ItaskCreationBody):Promise<ITask>
}