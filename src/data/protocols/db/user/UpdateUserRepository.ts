import { UserModel } from '@/domain/models/user/UserModel'

export interface UpdateUserRepository {
  update(user: UserModel): Promise<void>
}