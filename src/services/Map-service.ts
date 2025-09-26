//Reverse-geocoding-get users addresses/latitude and longitude/place Id find geographic coordinates for addresses on google Map using geocodingApi
import axios from 'axios'
import { Iauth, Ilatlong } from '../Interface/auth-interface';
import { number } from 'yup';
class MapService{
   public static async getGpsLongLat(address: string){
        //neomatim geolocationApi
        try{
            const params ={
                ip: address,
            }
            const config={
                headers:{
                    Authorization:`Bearer ${process.env.THIRD_PARTY_KEY}` as string,
                    'content-type':'application/json',
                    'user-agent': process.env.USER_AGENT
                }
            }
             const latitude = await axios.get<string>(`https://ipapi.co/${params.ip}/latitude/`)
             if(!latitude){
                throw new Error('third party latitude search error')
             }
             const lat= parseFloat(latitude.data)
             const longitude =await axios.get<string>(`https://ipapi.co/${params.ip}/longitude/`)
             if(!longitude){
                throw new Error('third party longitude search error')
             }
             const long= parseFloat(longitude.data)
             return {lat,long}
        }catch(error){
            throw new Error('failed, Gps long?Lat? error')
        }
    }
   public static async reverseGeocoding(lat:number, lon: number){
        try{
            const res = await axios.get(``)
        }catch(error){
            throw new Error('reverse geocoding failed')
        }
    }
  async findNearestCoordinates(record: Partial<Iauth>){
    const query={
        where:{...record}
    }
    
  }
};
export default MapService;