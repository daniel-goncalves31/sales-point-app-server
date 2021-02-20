import { UserModel } from './UserModel'

export type AuthenticationModel = {
  user: Omit<UserModel, 'password' | 'accessToken'>
  accessToken: string
}
