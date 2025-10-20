import userModel from "../model/user-schema";
import { Iauth} from "../Interface/auth-interface";
import sequelize from "../database";

let users=[{
     id: "eueuieir",
    fullName:"sam altman",
    username: "Great geek",
    email: "timz@gmail.com",
    companyName: "macbook inc" ,
    password: "tems",
    role: "user",
    ipAddress: "::1" ,
    latitude: 37.423,
    longitude: -122.083,
    isEmailVerified: false,
    createdAt: '2025-09-10 02:47:51',
    updatedAt: '2025-10-02 08:35:36'
} as Iauth,{
 id: "v90emr",
    fullName:"jog Frank",
    username: "small geek",
    email: "timz@gmail.com",
    companyName: "macbook inc" ,
    password: "tems",
    role: "user",
    ipAddress: "::1" ,
    latitude: 37.4302,
    longitude: -122.0958,
    isEmailVerified: false,
    createdAt:'2025-09-10 02:47:51',
    updatedAt:'2025-10-02 08:35:36'} as Iauth,
    {
    id: "lppppcd9",
    fullName:"mighty man",
    username: "noob emma",
    email: "timz@gmail.com",
    companyName: "macbook inc" ,
    password: "tems",
    role: "user",
    ipAddress: "::1" ,
    latitude: 37.4159,
    longitude: -122.0958,
    isEmailVerified: false,
    createdAt: '2025-09-10 02:47:51',
    updatedAt:'2025-10-02 08:35:36'
} as Iauth,{
 id: "eueuieir",
    fullName:"mbappe french",
    username: "star ezra",
    email: "timz@gmail.com",
    companyName: "macbook inc" ,
    password: "tems",
    role: "user",
    ipAddress: "::1" ,
    latitude: 37.4859,
    longitude: -122.0961,
    isEmailVerified: false,
    createdAt: '2025-09-10 02:47:51',
    updatedAt:'2025-10-02 08:35:36'
} as Iauth
] 

const createSeederData=async()=>{
   try{
    await sequelize.authenticate()
    await sequelize.sync()
    const  result= await userModel.bulkCreate(users,{ ignoreDuplicates: true })
     process.exit(0)
    }
   catch(error){
    console.log(error)
     process.exit(1)
   }
};

createSeederData()