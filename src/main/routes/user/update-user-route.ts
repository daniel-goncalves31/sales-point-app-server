import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeUpdateUserController } from '@/main/factories/controllers/user/update-user-controller-factory'
import { adminMaster } from '@/main/middlewares/admin-master-auth'

export default (router: Router): void => {
  router.put('/user', adminMaster, adaptRoute(makeUpdateUserController()))
}
