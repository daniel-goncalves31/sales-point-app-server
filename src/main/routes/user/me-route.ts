import { Router } from 'express'
import { auth } from '@/main/middlewares/auth'

export default (router: Router): void => {
  router.get('/me', auth)
}
