import { UserModel } from '@/domain/models/user/UserModel'

export interface UpdateUserUseCase {
  update(user: UserModel): Promise<void>
}