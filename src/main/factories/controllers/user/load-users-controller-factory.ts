import { Controller } from '@/presentation/protocols/Controller'
import { LoadUsersController } from '@/presentation/controllers/user/LoadUsersController'
import { makeLoadUsersDbUseCase } from '../../usecases/user/db-load-users-factory'

export const makeLoadUsersController = (): Controller => {
  return new LoadUsersController(makeLoadUsersDbUseCase())
}
