import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoadProductsController } from '@/main/factories/controllers/product/load-products-factory'
import { auth } from '@/main/middlewares/auth'

export default (router: Router): void => {
  router.get('/product', auth, adaptRoute(makeLoadProductsController()))
}
