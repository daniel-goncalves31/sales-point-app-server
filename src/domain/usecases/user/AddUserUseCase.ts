import { NewUserModel } from '@/domain/models/user/NewUserModel'
import { UserModel } from '@/domain/models/user/UserModel'

export interface AddUserUseCase {
  add(newUser: NewUserModel): Promise<UserModel>
}