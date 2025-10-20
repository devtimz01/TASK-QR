import { DataTypes } from 'sequelize'
import Db from '../database/index'
import { InviteMessageModel } from '../Interface/task-interface'

const inviteModel = Db.define<InviteMessageModel>('inviteModel',{
    id:{
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
        primaryKey: true
    },
    message:{
        type: DataTypes.STRING,
        allowNull: false
    },
    expire:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    status:{
        type: DataTypes.ENUM('PENDING', 'ACCEPT' , 'DECLINE' ,'EXPIRED'),
        allowNull: false,
        defaultValue: 'PENDING'
    },
    receiverId:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
       
    },
    senderId:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        
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
        tableName: 'InviteMessage',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
})

export default inviteModel;