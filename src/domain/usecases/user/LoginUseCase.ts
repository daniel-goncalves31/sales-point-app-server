import { LoginCredentialsModel } from '@/domain/models/user/LoginCredentialsModel'
import { AuthenticationModel } from '@/domain/models/user/AuthenticationModel'

export interface LoginUseCase {
  login(
    loginCredentials: LoginCredentialsModel
  ): Promise<AuthenticationModel | null>
}
