import { LoadAllUsersController } from '@/presentation/controllers/user/LoadAllUsersController'
import { Controller } from '@/presentation/protocols/Controller'
import { makeLoadAllUsersUseCase } from '../../usecases/user/db-load-all-users-factory'

export const makeLoadAllUsersController = (): Controller => {

  return new LoadAllUsersController(makeLoadAllUsersUseCase())
}