import { UserModel } from '@/domain/models/user/UserModel'

export interface LoadAllUsersUseCase {
  load(): Promise<UserModel[]>
}
