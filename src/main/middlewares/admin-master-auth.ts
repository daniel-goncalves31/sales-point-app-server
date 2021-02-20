import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { UserRole } from '@/domain/models/user/UserModel'

export const adminMaster = adaptMiddleware(
  makeAuthMiddleware([UserRole.ADMIN_MASTER])
)
