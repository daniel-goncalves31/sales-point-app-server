import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoadPurchasesController } from '@/main/factories/controllers/purchase/load-purchases-controller-factory'
import { adminAuth } from '@/main/middlewares/admin-auth'

export default (router: Router): void => {
  router.get('/purchase', adminAuth, adaptRoute(makeLoadPurchasesController()))
}
