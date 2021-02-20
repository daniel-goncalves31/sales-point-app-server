import { DbLoadAllUsersUseCase } from '@/data/usecases/user/DbLoadAllUsersUseCase'
import { LoadAllUsersUseCase } from '@/domain/usecases/user/LoadAllUsersUseCase'
import { UserTypeOrmRepository } from '@/infra/db/typeorm/repositories/UserTypeOrmRepository'

export const makeLoadAllUsersUseCase = (): LoadAllUsersUseCase => {
  const loadAllUsersRepository = new UserTypeOrmRepository()
  return new DbLoadAllUsersUseCase(loadAllUsersRepository)
}