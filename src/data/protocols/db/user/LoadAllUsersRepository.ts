import { UserModel } from '@/domain/models/user/UserModel'

export interface LoadAllUsersRepository {
  getAllUsers(): Promise<UserModel[]>
}
