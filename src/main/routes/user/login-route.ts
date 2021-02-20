import { Router } from 'express'
import { makeLoginController } from '../../factories/controllers/user/login-controller-factory'
import { adaptAuthRoute } from '@/main/adapters/express-auth-route-adapter'

export default (router: Router): void => {
  router.post('/login', adaptAuthRoute(makeLoginController()))
}
