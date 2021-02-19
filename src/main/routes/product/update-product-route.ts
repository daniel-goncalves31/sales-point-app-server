import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeUpdateProductController } from '@/main/factories/controllers/product/update-product-factory'
import { adminAuth } from '@/main/middlewares/admin-auth'

export default (router: Router): void => {
  router.put('/product', adminAuth, adaptRoute(makeUpdateProductController()))
}
