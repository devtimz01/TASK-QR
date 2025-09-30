//Reverse-geocoding-get users addresses/latitude and longitude/place Id find geographic coordinates for addresses on google Map using geocodingApi
import axios from 'axios'
import { Iauth } from '../Interface/auth-interface';
import AuthDataSource from '../datasource/auth-datasource';
class MapService{
public authDatasource :AuthDataSource
   constructor(_authData: AuthDataSource){
           this.authDatasource = _authData
       }
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
  async getDistanceinKM(selfLat: number, selfLong:number, usersLat: number, usersLong: number){
    const dlat=( selfLat-usersLat)*Math.PI/180
    const dlong=( selfLong-usersLong)*Math.PI/180
    const c=Math.sin(dlat/2)*Math.sin(dlat/2)+Math.cos(selfLat*Math.PI/180)*Math.cos(usersLat*Math.PI/180)*Math.sin(dlong/2)*Math.sin(dlong/2)
    const a = 2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c))
    const R = 6371
    return R*a
  }
  async findAllusersLatlong(): Promise<Iauth[]>{
    let latitude; let longitude; let id;
    const query ={
        attributes:[id,latitude,longitude],
        raw: true,
    }
     return await this.authDatasource.findAll(query as any)
  }
  async findNearestCoordinates(latlong: Partial<Iauth>):Promise<Iauth| string | null>{
    const query={
        where:{...latlong}
    };
    let users = await this.findAllusersLatlong()
    let nearestDistance: Iauth | null= null;
    let minDistance = Infinity
    const selfLatitude= query.where.latitude as number
    const selfLongitude=query.where.longitude as number
    for (let i =0; i<users.length; i++){
        const user = users[i]
        let proximity = await this.getDistanceinKM(selfLatitude,selfLongitude,user.latitude, user.longitude)
        let maxProximity =10
        if(proximity < maxProximity && proximity< minDistance){
            minDistance = proximity
            nearestDistance = user
        }
    }
    if(!nearestDistance){
        throw new Error('no nearby collaborators available for search')
    }
   return nearestDistance.id
  };
  async producer(){
    
  }
};
export default MapService;