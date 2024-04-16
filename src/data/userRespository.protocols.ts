import { UserModel } from "../domain/model/user";

export interface IUserRepository {
    findUser(username: string, password: string): Promise<UserModel>
}