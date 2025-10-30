import  {v2 as cloudinary} from 'cloudinary'
import streamifier from 'streamifier'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

const storage = multer.memoryStorage()
export const upload= multer({storage})
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadStream=(fileBuffer:Buffer)=>{
    return new Promise<string>((resolve,reject)=>{
      const stream= cloudinary.uploader.upload_stream({resource_type:'raw'},(err,result)=>{
            if(err){
                reject(err)}
            if(result){
                resolve(result.secure_url)
            }
        })
       streamifier.createReadStream(fileBuffer).pipe(stream)
    })
};
export default uploadStream;