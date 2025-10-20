//Reverse-geocoding-get users addresses/latitude and longitude/place Id find geographic coordinates for addresses on google Map using geocodingApi
import axios from 'axios'
import { Iauth } from '../Interface/auth-interface';
import AuthDataSource from '../datasource/auth-datasource';
import { injectable } from 'tsyringe';
import utility from '../utils/log';
@injectable()
class MapService{
public authDatasource :AuthDataSource
   constructor(_authData: AuthDataSource){
           this.authDatasource = _authData
       }
   public static async getGpsLongLat(address: string){
        try{
            const ipAddress = utility.getPublicIp(address)|| "8.8.8.8"
            const params ={
                ip:ipAddress
            }
            const config={
                headers:{
                    Authorization:`Bearer ${process.env.THIRD_PARTY_KEY}` as string,
                    'content-type':'application/json',
                    'user-agent': process.env.USER_AGENT
                }
            }
             console.log(params.ip)
             const latitude = await axios.get(`https://ipapi.co/${params.ip}/latitude/`)
             console.log(latitude.data)
             if(!latitude.data){
                throw new Error('third party latitude search error')
             }
             const lat= parseFloat(latitude.data.toString().trim())
             const longitude =await axios.get(`https://ipapi.co/${params.ip}/longitude/`)
             console.log(longitude.data)
             if(!longitude.data){
                throw new Error('third party longitude search error')
             }
             const long= parseFloat(longitude.data.toString().trim())
             if(isNaN(long)|| isNaN(lat)){
                console.error(lat,long)
                throw new Error('latitude and long is Nan, invalid out')
             }
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
  async getDistanceinKM(selfLat: number, selfLong:number, usersLat: number, usersLong: number){
    try{const dlat=( selfLat-usersLat)*Math.PI/180
    const dlong=( selfLong-usersLong)*Math.PI/180
    const c=Math.sin(dlat/2)*Math.sin(dlat/2)+Math.cos(selfLat*Math.PI/180)*Math.cos(usersLat*Math.PI/180)*Math.sin(dlong/2)*Math.sin(dlong/2)
    const a = 2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c))
    const R = 6371
    return R*a}
    catch(error){
        console.log(error)
        throw new Error('cannot get distanceinKm')
    }
  }
  async findAllusersLatlong(): Promise<Iauth[]>{
    const query ={
        attributes:["id","latitude","longitude","username","email","fullName"],
    }
     return await this.authDatasource.findAll(query as any)
  }
  async findNearestCoordinates(latlong: Partial<Iauth>,userId: string):Promise<Iauth | null>{
    try{
    let users = await this.findAllusersLatlong()
    let nearestDistance: Iauth | null= null;
    let minDistance = Infinity
    if(!latlong.latitude|| !latlong.longitude){
        console.error(latlong.latitude, latlong.longitude)
        throw new Error('cannot get latlong.lat or latlong.long')
    }
    for (let i =0; i<users.length; i++){
        const user = users[i]
        if(String(user.id).trim() === String(userId).trim()) continue;
        let proximity = await this.getDistanceinKM(latlong.latitude as number ,latlong.longitude as number,user.latitude, user.longitude)
        let maxProximity =10
        if(proximity < maxProximity && proximity< minDistance){
            minDistance = proximity
            nearestDistance = user
        }
    }
    if(!nearestDistance){
        throw new Error('no nearby collaborators available from search')
    } 
  return nearestDistance;
}
   catch(error){
    console.error(error)
    throw new Error('cannot get nearest Coordinates')
   }
  };
};

export default MapService;