import { LogoutUseCase } from '@/domain/usecases/user/LogoutUseCase'
import { DbLogoutUseCase } from '@/data/usecases/user/DbLogoutUseCase'
import { UserTypeOrmRepository } from '@/infra/db/typeorm/repositories/UserTypeOrmRepository'

export const makeLogoutDbUseCase = (): LogoutUseCase => {
  const updateAccessTokenRepository = new UserTypeOrmRepository()
  return new DbLogoutUseCase(updateAccessTokenRepository)
}
