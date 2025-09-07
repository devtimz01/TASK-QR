import { Dialect, Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config();

const database= process.env.DB_NAME as string;
const username= process.env.DB_USER as string;
const password= process.env.DB_PASS as string;
const dialect= (process.env.DIALECT as Dialect) ?? "mysql";
const host= process.env.HOST as string;
const port= parseInt(process.env.PORT as string);

const sequelize = new Sequelize(database,username,password,{
    dialect,
    host,
    port,
    logging:false
});

export default sequelize;