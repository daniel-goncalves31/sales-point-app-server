import { DbUpdateUserUseCase } from '@/data/usecases/user/DbUpdateUserUseCase'
import { UpdateUserUseCase } from '@/domain/usecases/user/UpdateUserUseCase'
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter'
import { UserTypeOrmRepository } from '@/infra/db/typeorm/repositories/UserTypeOrmRepository'

export const makeUpdateUserDbUseCase = (): UpdateUserUseCase => {

  const updateUserRepository = new UserTypeOrmRepository()
  const encrypter = new BcryptAdapter(12)
  return new DbUpdateUserUseCase(updateUserRepository, encrypter)
}