import { UpdateUserController } from '@/presentation/controllers/user/UpdateUserController'
import { Controller } from '@/presentation/protocols/Controller'
import { makeUpdateUserDbUseCase } from '../../usecases/user/db-update-user-factory'
import { makeUpdateUserValidator } from '../../validators/user/update-user-validator-factory'

export const makeUpdateUserController = (): Controller => {
  return new UpdateUserController(makeUpdateUserValidator(), makeUpdateUserDbUseCase())
}