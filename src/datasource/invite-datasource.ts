import { Iauth } from "../Interface/auth-interface";
import { InviteDatasourceMethod, InviteMessage, InviteMessageBody, InviteQuery } from "../Interface/task-interface";
import inviteModel from "../model/invite-msg-model";

class InviteDatasource implements InviteDatasourceMethod{
    async createInvite(record: InviteMessageBody): Promise<InviteMessage> {
        return await inviteModel.create(record)
    }
   async updateInviteMessage(data: Partial<InviteMessageBody>, record: InviteQuery): Promise<InviteMessage> {
      const [update]= await inviteModel.update(data, record)
    if(update=== 0){
        throw new Error('no column updated')
    }
        return data as InviteMessage
   }
  async getInviteMessage(id: InviteQuery): Promise<InviteMessage | null> {
      return inviteModel.findOne(id)
  }
  async deleteMessage(message: Partial<InviteMessage>): Promise<void> {
       await inviteModel.destroy({where:{id: message}})
  }
};

export default InviteDatasource;