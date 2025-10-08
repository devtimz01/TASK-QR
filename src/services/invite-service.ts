import { injectable } from "tsyringe";
import { InviteMessage, InviteMessageBody, InviteQuery } from "../Interface/task-interface";
import InviteDatasource from "../datasource/invite-datasource";
import moment from "moment";

@injectable()
class InviteService{
    private inviteDatasource: InviteDatasource
    constructor(_invite: InviteDatasource){
        this.inviteDatasource= _invite
    }
    async createInvite(record: InviteMessageBody): Promise<InviteMessage>{
        const data= {
            ...record 
        } as InviteMessageBody
        return await this.inviteDatasource.createInvite(data)
    }
    async updateInviteStatus(record: Partial<InviteMessage>,status: Partial<InviteMessageBody>){
        const data={
            where:{
               ...record
            },
            raw: true
        } as InviteQuery
       await this.inviteDatasource.updateInviteMessage(status, data)
    }
    async getMessage(id:string): Promise<InviteMessage |null>{
        const data= {
            where:{
                id
            }, raw: true, returning: true
        } as InviteQuery
        return await this.inviteDatasource.getInviteMessage(data)
    }

};
export default InviteService;