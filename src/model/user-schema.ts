import { DataTypes, UUIDV4 } from 'sequelize'
import Db from '../database/index'
import { Imodel } from '../Interface/auth-interface.js'

const userModel = Db.define<Imodel>('userModel',{
    id: {
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
        type:DataTypes.UUID,
        primaryKey: true
    },
    ipAddress:{
        allowNull: true,
        defaultValue: 'NULL',
        type: DataTypes.STRING
    },
    latitude:{
        allowNull:true,
        type: DataTypes.FLOAT
    },
     longitude:{
        allowNull:true,
        type: DataTypes.FLOAT
    },
    username:{
        allowNull: false,
        unique:true,
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
    isEmailVerified:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    fullName:{
        allowNull:false,
        unique:false,
        type: DataTypes.STRING
    },
    password:{
        allowNull:false,
        unique:false,
        type:DataTypes.STRING
    },
    role:{
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue:"user"
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
    tableName: 'users',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}
);

export default userModel;