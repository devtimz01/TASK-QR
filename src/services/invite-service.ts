import { injectable } from "tsyringe";
import { InviteMessage, InviteMessageBody, InviteQuery } from "../Interface/task-interface";
import InviteDatasource from "../datasource/invite-datasource";

@injectable()
class InviteService{
    private inviteDatasource: InviteDatasource
    constructor(_invite: InviteDatasource){
        this.inviteDatasource= _invite
    }
    async createInvite(record: InviteMessageBody): Promise<InviteMessage>{
        return await this.inviteDatasource.createInvite(record)
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
    async getMessage(id: Partial<InviteMessageBody>): Promise<InviteMessage |null>{
        const data= {
            where:{
                ...id
            }, raw: true, returning: true
        } as InviteQuery
        return await this.inviteDatasource.getInviteMessage(data)
    }

};
export default InviteService;