import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeDeletePurchaseController } from '@/main/factories/controllers/purchase/delete-purchase-controller-factory'
import { adminAuth } from '@/main/middlewares/admin-auth'

export default (router: Router): void => {
  router.delete(
    '/purchase',
    adminAuth,
    adaptRoute(makeDeletePurchaseController())
  )
}
