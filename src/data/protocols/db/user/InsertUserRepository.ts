import { UserModel } from '@/domain/models/user/UserModel'

export interface InsertUserRepository {
  insert(newUser: UserModel): Promise<UserModel>
}