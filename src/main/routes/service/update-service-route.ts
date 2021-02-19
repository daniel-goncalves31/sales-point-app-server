import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeUpdateServiceController } from '@/main/factories/controllers/service/update-service-controller-factory'
import { auth } from '@/main/middlewares/auth'

export default (router: Router): void => {
  router.put('/service', auth, adaptRoute(makeUpdateServiceController()))
}
