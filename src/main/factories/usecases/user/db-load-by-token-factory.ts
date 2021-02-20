import { LoadUserByTokenUseCase } from '@/domain/usecases/user/LoadUserByToken'
import { DbLoadUserByTokenUseCase } from '@/data/usecases/user/DbLoadUserByTokenUseCase'
import { JsonwebtokenAdapter } from '@/infra/cryptography/JsonwebtokenAdapter'
import { env } from '@/main/config/env'
import { UserTypeOrmRepository } from '@/infra/db/typeorm/repositories/UserTypeOrmRepository'

export const makeDbLoadByTokenUseCase = (): LoadUserByTokenUseCase => {
  const decrypter = new JsonwebtokenAdapter(env.JWT_SECRET)
  const loadUserByTokenRepository = new UserTypeOrmRepository()
  return new DbLoadUserByTokenUseCase(decrypter, loadUserByTokenRepository)
}
