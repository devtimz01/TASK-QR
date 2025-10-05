import { InviteDatasourceMethod, InviteMessage, InviteMessageBody, InviteQuery } from "../Interface/task-interface";
import inviteModel from "../model/invite-msg-model";

class InviteDatasource implements InviteDatasourceMethod{
    async createInvite(record: InviteMessageBody): Promise<InviteMessage> {
        return await inviteModel.create(record)
    }
   async updateInviteMessage(data: Partial<InviteMessageBody>, record: InviteQuery): Promise<void> {
       await inviteModel.update(data, record)
   }
};

export default InviteDatasource;