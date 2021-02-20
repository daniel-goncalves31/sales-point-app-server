import { LoginUseCase } from '@/domain/usecases/user/LoginUseCase'
import { UserTypeOrmRepository } from '@/infra/db/typeorm/repositories/UserTypeOrmRepository'
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter'
import { env } from '@/main/config/env'
import { JsonwebtokenAdapter } from '@/infra/cryptography/JsonwebtokenAdapter'
import { DbLoginUseCase } from '@/data/usecases/user/DbLoginUseCase'

export const makeLoginUseCase = (): LoginUseCase => {
  const userTypeOrmRepository = new UserTypeOrmRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const jwtAdapter = new JsonwebtokenAdapter(env.JWT_SECRET)
  return new DbLoginUseCase(
    userTypeOrmRepository,
    bcryptAdapter,
    jwtAdapter,
    userTypeOrmRepository
  )
}
