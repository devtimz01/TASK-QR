import { DataTypes, UUID, UUIDV4 } from 'sequelize'
import Db from '../database/index'
import { IsubtaskModel, ItaskFolderModel,ItaskModel } from '../Interface/task-interface'

export const TaskModel = Db.define<ItaskModel>('TaskModel',{
     id: {
        allowNull: false,
        primaryKey:true,
        type: UUID,
        defaultValue: UUIDV4
    },
    taskName: {
        type:DataTypes.STRING,
        allowNull: false
    },
    files: {
        type:DataTypes.STRING,
        allowNull: true
    },
    dependencies: {
        type:DataTypes.STRING,
        allowNull: true
    },
    description:{
        type:DataTypes.STRING,
        allowNull: true
    },
    folderId:{
        allowNull:false,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID
    },
    collaborators: {
        type:DataTypes.STRING,
        allowNull: true
    },
    markAsComplete: {
        type:DataTypes.BOOLEAN,
        defaultValue: false
    },
    dueDate: {
        type:DataTypes.DATE,
        allowNull: true
    },
    notifications: {
        type:DataTypes.STRING,
        allowNull: true
    },
    comments: {
        type:DataTypes.STRING,
        allowNull: true
    },
    createdAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull:false
    },
    updatedAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull:false
    }
},
{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt:'updatedAt',
    tableName:'Task'
});

export const subTaskModel = Db.define<IsubtaskModel>('subTaskModel',{
     id: {
        allowNull: false,
        primaryKey:true,
        type: UUID,
        defaultValue: UUIDV4
    },
    taskName: {
        type:DataTypes.STRING,
        allowNull: false
    },
    files: {
        type:DataTypes.STRING,
        allowNull: true
    },
    dependencies: {
        type:DataTypes.STRING,
        allowNull: true
    },
    description:{
        type: DataTypes.STRING,
        
    },
    collaborators: {
        type:DataTypes.STRING,
        allowNull: true
    },
    markAsComplete: {
        type:DataTypes.BOOLEAN,
        defaultValue: false
    },
    dueDate: {
        type:DataTypes.DATE,
        allowNull: true
    },
    notifications: {
        type:DataTypes.STRING,
        allowNull: true
    },
    comments: {
        type:DataTypes.STRING,
        allowNull: true
    },
    TaskId:{
        allowNull:false,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID
    },
    createdAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull:false
    },
    updatedAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull:false
    }
},
{
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt:'updatedAt',
    tableName:'subtask'
});

TaskModel.hasMany(subTaskModel,{foreignKey:'TaskId', as:'subTasks'})
subTaskModel.belongsTo(TaskModel,{foreignKey:'TaskId', as:'Tasks'})

const TaskFolderModel = Db.define<ItaskFolderModel>('TaskFolderModel',{
    id: {
        allowNull: false,
        primaryKey:true,
        type: UUID,
        defaultValue: UUIDV4
    },
    status:{
        type: DataTypes.ENUM('PENDING','IN_PROGRESS','OVERDUE','COMPLETED'),
        defaultValue:"PENDING",
        allowNull: false
    },
    image:{
        allowNull:true,
        type: DataTypes.STRING
    },
    taskFolderName:{
        allowNull: false,
        type: DataTypes.STRING
    },
    createdAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull:false
    },
    updatedAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull:false
    },
},{
    timestamps: true,
    tableName:'TaskFolder',
    createdAt: 'createdAt',
    updatedAt:'updatedAt'
});

TaskFolderModel.hasMany(TaskModel,{foreignKey: 'folderId',as:'tasks'})
TaskModel.belongsTo(TaskFolderModel,{foreignKey:'folderId',as:'folder'})

export default TaskFolderModel;