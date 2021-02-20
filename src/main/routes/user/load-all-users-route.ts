import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoadAllUsersController } from '@/main/factories/controllers/user/load-all-users-controller-factory'
import { adminMaster } from '@/main/middlewares/admin-master-auth'

export default (router: Router): void => {
  router.get('/users', adminMaster, adaptRoute(makeLoadAllUsersController()))
}
