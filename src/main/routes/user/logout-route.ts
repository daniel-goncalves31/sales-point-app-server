import { Router } from 'express'
import { auth } from '@/main/middlewares/auth'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLogoutController } from '@/main/factories/controllers/user/logout-controller-factory'

export default (router: Router): void => {
  router.get('/logout', auth, adaptRoute(makeLogoutController()))
}
