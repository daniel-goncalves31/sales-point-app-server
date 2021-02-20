import { LoginUseCase } from '@/domain/usecases/user/LoginUseCase'
import { LoadUserByUsernameRepository } from '@/data/protocols/db/user/LoadUserByUsernameRepository'
import { HashComparer } from '@/data/protocols/cryptography/HashComparer'
import { Encrypter } from '@/data/protocols/cryptography/Encrypter'
import { UpdateAcessTokenRepository } from '@/data/protocols/db/user/UpdateAcessTokenRepository'
import { LoginCredentialsModel } from '@/domain/models/user/LoginCredentialsModel'
import { AuthenticationModel } from '@/domain/models/user/AuthenticationModel'

export class DbLoginUseCase implements LoginUseCase {
  constructor(
    private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAcessTokenRepository: UpdateAcessTokenRepository
  ) { }

  async login(
    loginCredentials: LoginCredentialsModel
  ): Promise<AuthenticationModel | null> {
    const user = await this.loadUserByUsernameRepository.getUserByUsername(
      loginCredentials.username
    )

    if (user) {
      const isValid = await this.hashComparer.compare(
        loginCredentials.password,
        user.password
      )
      if (isValid) {
        const accessToken = this.encrypter.encrypt(user.id)
        await this.updateAcessTokenRepository.updateAccessToken(user.id, accessToken)

        delete user.password
        delete user.accessToken

        return {
          user,
          accessToken
        }
      }
    }

    return null
  }
}
