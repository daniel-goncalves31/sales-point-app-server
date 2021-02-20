import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeAddPurchaseController } from '@/main/factories/controllers/purchase/add-purchase-controller-factory'
import { adminAuth } from '@/main/middlewares/admin-auth'

export default (router: Router): void => {
  router.post('/purchase', adminAuth, adaptRoute(makeAddPurchaseController()))
}
