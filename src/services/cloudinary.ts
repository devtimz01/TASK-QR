import  {v2 as cloudinary} from 'cloudinary'
import streamifier from 'streamifier'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


const uploadStream=(fileBuffer:string):Promise<String>=>{
    return new Promise((reject,resolve)=>{
      const stream= cloudinary.uploader.upload_stream((err,result)=>{
            if(err){
                reject}
            if(result){
                resolve
            }
        })
       streamifier.createReadStream(fileBuffer).pipe(stream)
    })
};

export default uploadStream;
