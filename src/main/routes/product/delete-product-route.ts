import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeDeleteProductController } from '@/main/factories/controllers/product/delete-product-controller'
import { adminAuth } from '@/main/middlewares/admin-auth'

export default (router: Router): void => {
  router.delete(
    '/product',
    adminAuth,
    adaptRoute(makeDeleteProductController())
  )
}
