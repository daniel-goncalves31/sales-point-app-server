import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { adminAuth } from '@/main/middlewares/admin-auth'
import { makeDeleteServiceController } from '@/main/factories/controllers/service/delete-service-controller-factory'

export default (router: Router): void => {
  router.delete(
    '/service',
    adminAuth,
    adaptRoute(makeDeleteServiceController())
  )
}
