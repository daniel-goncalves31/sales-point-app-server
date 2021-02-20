import { LogoutUseCase } from '@/domain/usecases/user/LogoutUseCase'
import { UpdateAcessTokenRepository } from '@/data/protocols/db/user/UpdateAcessTokenRepository'

export class DbLogoutUseCase implements LogoutUseCase {
  constructor(
    private readonly updateAcessTokenRepositoryStub: UpdateAcessTokenRepository
  ) { }

  async logOut(currentUserId: string): Promise<void> {
    await this.updateAcessTokenRepositoryStub.updateAccessToken(currentUserId, '')
  }
}
