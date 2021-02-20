import { AddUserController } from '@/presentation/controllers/user/AddUserController'
import { Controller } from '@/presentation/protocols/Controller'
import { makeAddUserUseCase } from '../../usecases/user/db-add-user-factory'
import { makeAddUserValidator } from '../../validators/user/add-user-validator-factory'

export const makeAddUserController = (): Controller => {
  return new AddUserController(makeAddUserValidator(), makeAddUserUseCase())
}