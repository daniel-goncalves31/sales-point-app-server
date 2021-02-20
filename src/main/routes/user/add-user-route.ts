import { Router } from 'express'
import { adaptRoute } from '../../adapters/express-route-adapter'
import { adminMaster } from '@/main/middlewares/admin-master-auth'
import { makeAddUserController } from '@/main/factories/controllers/user/add-user-controller-factory'

export default (router: Router): void => {
  router.post('/user', adminMaster, adaptRoute(makeAddUserController()))
}
