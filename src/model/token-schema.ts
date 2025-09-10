import { DataTypes } from 'sequelize';
import Db from '../database/index'
import { Itokenmodel } from '../Interface/Token-interface'

const tokenModel = Db.define<Itokenmodel>('tokenModel',{
    id: {
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
        type:DataTypes.UUID,
        primaryKey: true
    },
    code:{
        allowNull: false,
        unique:true,
        type: DataTypes.STRING
    },
    key:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    expire:{
        type: DataTypes.DATE,
        defaultValue:DataTypes.NOW,
        allowNull:false
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
},
{
    timestamps: true,
    tableName: 'verificationToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}
);

export default tokenModel;