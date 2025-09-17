import { Model, Optional } from "sequelize";

export interface ITask{
    id:string;
    taskName: string;
    dependencies: string
    files: string;
    description:string;
    subTask?:ITask[];
    folderId: string;
    collaborators:string;
    dueDate: Date;
    markAsComplete: boolean;
    notifications: string;
    comments: string;
    createdAt:string;
    updatedAt:string;
};
export interface IsubTask{
    id:string;
    taskName: string;
    dependencies: string
    files: string;
    description:string;
    collaborators:string;
    dueDate: Date;
    TaskId: string;
    markAsComplete: boolean;
    notifications: string;
    comments: string;
    createdAt:string;
    updatedAt:string;
};

export interface ITaskFolder{
    id:string;
    image: string;
    taskFolderName: string;
    Tasks?: ITask[];
    status:'PENDING'|'OVERDUE'|'IN_PROGRESS'|'COMPLETED';
    createdAt: string;
    updatedAt:string
};

export interface ItaskCreationBody extends Optional<ITask, 'id'|'createdAt'|'updatedAt'>{}
export interface IsubtaskCreationBody extends Optional<IsubTask, 'id'|'createdAt'|'updatedAt'>{}
export interface ItaskFolderCreationBody extends Optional<ITaskFolder, 'id'|'createdAt'|'updatedAt'>{}
export interface ItaskFolderModel extends Model <ITaskFolder,ItaskFolderCreationBody>,ITaskFolder{}
export interface ItaskModel extends Model <ITask,ItaskCreationBody>,ITask{}
export interface IsubtaskModel extends Model <IsubTask,IsubtaskCreationBody>,IsubTask{}
export interface ItaskDataSoruce{
    createTask(record: ItaskCreationBody):Promise<ITask>
}