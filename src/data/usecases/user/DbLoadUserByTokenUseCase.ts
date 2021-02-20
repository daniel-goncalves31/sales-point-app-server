import { LoadUserByTokenUseCase } from '@/domain/usecases/user/LoadUserByToken'
import { UserModel, UserRole } from '@/domain/models/user/UserModel'
import { Decrypter } from '@/data/protocols/cryptography/Decrypter'
import { LoadUserByTokenRepository } from '@/data/protocols/db/user/LoadUserByTokenRepository'

export class DbLoadUserByTokenUseCase implements LoadUserByTokenUseCase {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository
  ) {}

  async load (
    accessToken: string,
    allowedRoles?: UserRole[]
  ): Promise<UserModel | null> {
    let token: string | null = null
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (token) {
      const user = await this.loadUserByTokenRepository.loadByToken(accessToken)
      if (user) {
        if (!allowedRoles || allowedRoles.some(role => role === user.role)) {
          return user
        }
      }
    }
    return null
  }
}
