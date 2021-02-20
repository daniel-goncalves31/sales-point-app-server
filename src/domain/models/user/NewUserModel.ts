import { UserRole, UserStatus } from './UserModel'

export interface NewUserModel {
  username: string,
  password: string,
  name: string,
  role: UserRole,
  status: UserStatus
}