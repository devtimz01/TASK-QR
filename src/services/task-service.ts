import { injectable } from "tsyringe";

@injectable()
class TasKSerivce{
    public static async assignTaskByGeolocation(){
        //geocode each users lat and longitude (optional googleMap Api)
        //integrate cron to re-run service.
        
    }
    async cloudinary(){

    }

    async CDN(){
        
    }
};

export default TasKSerivce;