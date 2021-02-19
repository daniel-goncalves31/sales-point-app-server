import { Controller } from '@/presentation/protocols/Controller'
import { LogoutController } from '@/presentation/controllers/user/LogoutController'
import { makeLogoutDbUseCase } from '../../usecases/user/db-logout-factory'

export const makeLogoutController = (): Controller => {
  return new LogoutController(makeLogoutDbUseCase())
}
