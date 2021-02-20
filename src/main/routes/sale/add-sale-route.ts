import { Router } from 'express'
import { auth } from '@/main/middlewares/auth'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeAddSaleController } from '@/main/factories/controllers/sale/add-sale-controller-factory'

export default (router: Router): void => {
  router.post('/sale', auth, adaptRoute(makeAddSaleController()))
}
