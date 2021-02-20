import { UserModel, UserRole } from '@/domain/models/user/UserModel'

export interface LoadUserByTokenUseCase {
  load: (
    accessToken: string,
    allowedRoles?: UserRole[]
  ) => Promise<UserModel | null>
}
