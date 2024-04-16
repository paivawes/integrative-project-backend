import { IUserRepository } from "../../../data/userRespository.protocols";
import { UserModel } from "../../../domain/model/user";

class UserRepository implements IUserRepository {
    async findUser(username: string, password: string): Promise<UserModel> {
        const connection = 

        return ''
    }
}

export {UserRepository}