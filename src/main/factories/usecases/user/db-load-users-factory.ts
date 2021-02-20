import { LoadUsersUseCase } from '@/domain/usecases/user/LoadUsersUseCase'
import { DbLoadUsersUseCase } from '@/data/usecases/user/DbLoadUsersUseCase'
import { UserTypeOrmRepository } from '@/infra/db/typeorm/repositories/UserTypeOrmRepository'

export const makeLoadUsersDbUseCase = (): LoadUsersUseCase => {
  const loadUsersRepository = new UserTypeOrmRepository()
  return new DbLoadUsersUseCase(loadUsersRepository)
}
