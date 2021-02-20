import { UserModel } from '@/domain/models/user/UserModel'

export interface LoadUserByTokenRepository {
  loadByToken: (token: string) => Promise<UserModel | null>
}
