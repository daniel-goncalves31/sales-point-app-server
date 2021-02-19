import { Middleware } from '@/presentation/protocols/Middleware'
import { AuthMiddleware } from '@/presentation/middlewares/AuthMiddleware'
import { makeDbLoadByTokenUseCase } from '../usecases/user/db-load-by-token-factory'
import { UserRole } from '@/domain/models/user/UserModel'

export const makeAuthMiddleware = (allowedRoles?: UserRole[]): Middleware => {
  return new AuthMiddleware(makeDbLoadByTokenUseCase(), allowedRoles)
}
