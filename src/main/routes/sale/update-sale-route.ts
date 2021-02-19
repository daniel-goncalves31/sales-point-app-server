import { Router } from 'express'
import { adminAuth } from '@/main/middlewares/admin-auth'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeUpdateSaleController } from '@/main/factories/controllers/sale/update-sale-controller-factory'

export default (router: Router): void => {
  router.put('/sale', adminAuth, adaptRoute(makeUpdateSaleController()))
}
