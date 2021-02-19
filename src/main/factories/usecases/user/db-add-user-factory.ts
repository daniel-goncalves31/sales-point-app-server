import { DbAddUserUseCase } from '@/data/usecases/user/DbAddUserUseCase'
import { AddUserUseCase } from '@/domain/usecases/user/AddUserUseCase'
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter'
import { UserTypeOrmRepository } from '@/infra/db/typeorm/repositories/UserTypeOrmRepository'
import { UUIDAdapter } from '@/infra/generators/UUIDAdapter'

export const makeAddUserUseCase = (): AddUserUseCase => {
  const insertUserRepository = new UserTypeOrmRepository()
  const encrypter = new BcryptAdapter(12)
  const uuidGenerator = new UUIDAdapter()
  return new DbAddUserUseCase(insertUserRepository, encrypter, uuidGenerator)
}