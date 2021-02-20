import { Router } from 'express'
import { auth } from '@/main/middlewares/auth'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoadSalesController } from '@/main/factories/controllers/sale/load-sales-controller-factory'

export default (router: Router): void => {
  router.get('/sale', auth, adaptRoute(makeLoadSalesController()))
}
