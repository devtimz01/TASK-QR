import {Model, Optional} from 'sequelize'
export interface Iauth{
    id: string;
    fullName:string;
    username: string;
    email: string;
    companyName: string;
    password: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt:string;
}
export interface IuserQuery{
    where:{
        [key:string]:true
    },
    raw?: boolean
    returning: boolean
}

export interface IuserCreationBody extends Optional<Iauth,"id"|"createdAt"|"updatedAt">{}
export interface Imodel extends Model<Iauth,IuserCreationBody>,Iauth{}
export interface IuserDataSource{
    create(record:IuserCreationBody):Promise<Iauth>
    find(filter:IuserQuery):Promise<Iauth|null>
    update(data: Partial<Iauth>,sortBy:IuserQuery): Promise<void>
}
