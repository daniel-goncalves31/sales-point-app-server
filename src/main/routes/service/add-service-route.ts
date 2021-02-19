import { Router } from 'express'
import { adaptRoute } from '../../adapters/express-route-adapter'
import { makeAddServiceController } from '@/main/factories/controllers/service/add-service-controller-factory'
import { auth } from '@/main/middlewares/auth'

export default (router: Router): void => {
  router.post('/service', auth, adaptRoute(makeAddServiceController()))
}
