import { Controller } from '@/presentation/protocols/Controller'
import { LoginController } from '@/presentation/controllers/user/LoginController'
import { makeLoginValidator } from '../../validators/user/login-validator-factory'
import { makeLoginUseCase } from '../../usecases/user/db-login-factory'

export const makeLoginController = (): Controller => {
  return new LoginController(makeLoginValidator(), makeLoginUseCase())
}
