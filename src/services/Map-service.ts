//Reverse-geocoding-get users addresses/latitude and longitude/place Id find geographic coordinates for addresses on google Map using geocodingApi
import axios from 'axios'
class MapService{
   public static async getGpsLongLat(address: string){
        //W3c geolocationApi
        try{
            const param ={
                address: ''
            }
            const config={
                headers:{
                    Authorization:`Bearer ${process.env.THIRD_PARTY_KEY}` as string,
                    'content-type':'application/json',
                    'user-agent': process.env.USER_AGENT
                }
            }
            const data = await axios.get(``)
            
        }catch(err){
            throw new Error('failed, Gps long?Lat? error')
        }
    }
    async getCorrespondingCoordinates(){

    }
}