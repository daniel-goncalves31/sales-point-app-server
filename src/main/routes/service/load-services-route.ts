import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { auth } from '@/main/middlewares/auth'
import { makeLoadServicesController } from '@/main/factories/controllers/service/load-service-controller-factory'

export default (router: Router): void => {
  router.get('/service', auth, adaptRoute(makeLoadServicesController()))
}
