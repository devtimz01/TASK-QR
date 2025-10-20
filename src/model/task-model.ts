import { DataTypes } from 'sequelize'
import Db from '../database/index'
import { IcollaboratorsModel, IsubtaskModel, ItaskFolderModel,ItaskModel } from '../Interface/task-interface'

export const TaskModel = Db.define<ItaskModel>('TaskModel',{
     id: {
        allowNull: false,
        primaryKey:true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    taskName: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
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
        type: DataTypes.UUID
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
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    taskName: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
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

export const collaboratorsModel = Db.define<IcollaboratorsModel>('collaboratorsModel',{
    id: {
            defaultValue: DataTypes.UUIDV4,
            allowNull:false,
            type:DataTypes.UUID,
            primaryKey: true
        },
    taskId:{
        allowNull:false,
        type:DataTypes.UUID,
        unique: 'key_constraint'
    },
        username:{
            allowNull: false,
            unique:'key_constraint',
            type: DataTypes.STRING
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        companyName:{
            type: DataTypes.STRING,
            allowNull: true
        },
        fullName:{
            allowNull:false,
            unique:false,
            type: DataTypes.STRING
        },
        role:{
            type: DataTypes.ENUM("ASSIGNEE","PENDING"),
            allowNull:false,
            defaultValue:"PENDING"
        },
        createdAt:{
            type: DataTypes.DATE,
            allowNull:false,
            defaultValue:DataTypes.NOW
        },
        updatedAt:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue:DataTypes.NOW
        }
}, {
        timestamps: true,
        tableName: 'collaborators',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
});
TaskModel.hasMany(collaboratorsModel,{foreignKey:'taskId'})
collaboratorsModel.belongsTo(TaskModel,{foreignKey:'taskId',constraints: false})

subTaskModel.hasMany(collaboratorsModel,{foreignKey:'taskId'})
collaboratorsModel.belongsTo(subTaskModel,{foreignKey:'taskId', constraints: false})

const TaskFolderModel = Db.define<ItaskFolderModel>('TaskFolderModel',{
    id: {
        allowNull: false,
        primaryKey:true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
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
        type: DataTypes.STRING,
        unique:true
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