import { Router } from 'express'
import { adaptRoute } from '../../adapters/express-route-adapter'
import { makeAddProductController } from '../../factories/controllers/product/add-product-factory'
import { adminAuth } from '@/main/middlewares/admin-auth'

export default (router: Router): void => {
  router.post('/product', adminAuth, adaptRoute(makeAddProductController()))
}
