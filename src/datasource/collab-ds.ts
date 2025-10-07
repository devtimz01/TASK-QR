import { IcollabDataSourceMethod, Icollaborators, IcollaboratorsCreationBody, ITask } from "../Interface/task-interface";
import { collaboratorsModel } from "../model/task-model";
class CollabDataSource implements IcollabDataSourceMethod{
   async createCollaborator(record: IcollaboratorsCreationBody): Promise<Icollaborators> {
      return await collaboratorsModel.create(record)
   }
};

export default CollabDataSource;