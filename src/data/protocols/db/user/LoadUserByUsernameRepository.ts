import { UserModel } from '@/domain/models/user/UserModel'

export interface LoadUserByUsernameRepository {
  getUserByUsername: (username: string) => Promise<UserModel | null>
}
