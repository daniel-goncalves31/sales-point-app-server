import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoadUsersController } from '@/main/factories/controllers/user/load-users-controller-factory'
import { auth } from '@/main/middlewares/auth'

export default (router: Router) => {
  router.get('/user', auth, adaptRoute(makeLoadUsersController()))
}
