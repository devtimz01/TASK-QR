import { Itoken, ItokenCreationBody, ItokenDataSource, ItokenQuery } from "../Interface/Token-interface";
import tokenModel from "../model/token-schema";

class TokenDataSource implements ItokenDataSource{
    async create(record: ItokenCreationBody): Promise<Itoken> {
        return await tokenModel.create(record)
    }
    async find(filter: ItokenQuery): Promise<Itoken | null> {
        return await tokenModel.findOne(filter)
    }

    async update(data: Partial<Itoken>,filter: ItokenQuery): Promise<void> {
              await tokenModel.update(data, filter)
    }
}

export default TokenDataSource;