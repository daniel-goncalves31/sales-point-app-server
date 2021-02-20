import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeDeleteSaleController } from '@/main/factories/controllers/sale/delete-sale-controller-factory'
import { adminAuth } from '@/main/middlewares/admin-auth'

export default (router: Router): void => {
  router.delete('/sale', adminAuth, adaptRoute(makeDeleteSaleController()))
}
