import { Model, Optional } from "sequelize";

export interface Itoken{
    id: string;
    key:string;
    code:string;
    status:string;
    expire: Date;
    createdAt:string;
    updatedAt: string
};

export interface ItokenQuery{
    where:{
        [key:string]:true
    },
    raw?: boolean
    returning: boolean
}

export interface ItokenCreationBody extends Optional<Itoken,"id"|"createdAt"|"updatedAt">{}
export interface Itokenmodel extends Model<Itoken,ItokenCreationBody>,Itoken{}
export interface ItokenDataSource{
    create(record:ItokenCreationBody):Promise<Itoken>
    find(filter:ItokenQuery):Promise<Itoken|null>
    update(data: Partial<Itoken>,filter:ItokenQuery):Promise<void>
}