import { Model, Optional } from "sequelize";
import { Iauth } from "./auth-interface";

export interface ITask{
    id:string;
    taskName: string;
    dependencies: string
    files: string;
    description:string;
    subTask?:ITask[];
    folderId: string;
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
export interface Icollaborators{
    id: string;
    fullName:string;
    username: string;
    email: string;
    taskId?:string;
    subtaskId?: string;
    companyName: string;
    role: string;
    createdAt: string;
    updatedAt:string;
}
 export interface Imap{
    latlong: string
 }

 export interface InviteMessage{
    id: string;
    message: string;
    status: string;
    receiverId: string;
    senderId: string;
    createdAt: string;
    updatedAt: string

 };
 export interface InviteQuery{
    where:{
        [key: string]: string
    },
    raw: true,
    returning?: true
 }

export interface ItaskCreationBody extends Optional<ITask, 'id'|'createdAt'|'updatedAt'>{}
export interface IsubtaskCreationBody extends Optional<IsubTask, 'id'|'createdAt'|'updatedAt'>{}
export interface ItaskFolderCreationBody extends Optional<ITaskFolder, 'id'|'createdAt'|'updatedAt'>{}
export interface ItaskFolderModel extends Model <ITaskFolder,ItaskFolderCreationBody>,ITaskFolder{}
export interface ItaskModel extends Model <ITask,ItaskCreationBody>,ITask{}
export interface IsubtaskModel extends Model <IsubTask,IsubtaskCreationBody>,IsubTask{}
export interface ItaskDataSoruce{
    createTaskFolder(record: ItaskFolderCreationBody):Promise<ITaskFolder>
    createTask(record: ItaskCreationBody):Promise<ITask>
    createSubTask(record: IsubtaskCreationBody):Promise<IsubTask>
}
export interface InviteMessageBody extends Optional<InviteMessage,"id"|"createdAt"|"updatedAt"|"receiverId"|"senderId">{}
export interface InviteMessageModel extends Model<InviteMessage,InviteMessageBody>,InviteMessage{}
export interface InviteDatasourceMethod{
    createInvite(record: InviteMessageBody): Promise<InviteMessage>
    updateInviteMessage(data: Partial<InviteMessageBody>, record:InviteQuery): Promise<void>
    getInviteMessage(id:InviteQuery):Promise<InviteMessage | null>
}
export interface IcollaboratorsCreationBody extends Optional<Icollaborators,"id"|"createdAt"|"updatedAt">{}
export interface IcollaboratorsModel extends Model<Icollaborators,IcollaboratorsCreationBody>,Icollaborators{}
export interface IcollabDataSourceMethod{
    createCollaborator(record: IcollaboratorsCreationBody): Promise<Icollaborators>
}