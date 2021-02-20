import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { adminAuth } from '@/main/middlewares/admin-auth'
import { makeUpdatePurchaseItemController } from '@/main/factories/controllers/purchase/update-purchase-item-controller-factory'

export default (router: Router): void => {
  router.put('/purchase-item', adminAuth, adaptRoute(makeUpdatePurchaseItemController()))
}
