import { Middleware } from '@/presentation/protocols/Middleware'
import { NextFunction, Request, Response } from 'express'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { setAuthCookie } from '../helpers/set-auth-cookie-helper'
import { UserModel } from '@/domain/models/user/UserModel'
import { env } from '../config/env'

interface IRequest extends Request {
  user?: UserModel
}

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: IRequest, res: Response, next: NextFunction) => {
    if (req.path === '/sale/' && req.headers.auth === env.AUTH_HEADER) {
      return next()
    }

    const httpRequest: HttpRequest = {
      headers: req.cookies
    }

    const httpResponse = await middleware.handle(httpRequest)

    if (httpResponse.status === 200) {
      setAuthCookie(res, (httpResponse.body as any).accessToken)
      if (req.path === '/me') {
        res.status(httpResponse.status).json((httpResponse.body as any).user)
      } else {
        req.user = (httpResponse.body as any).user
        next()
      }
    } else {
      res.status(httpResponse.status).json({
        error: (httpResponse.body as any).message
      })
    }
  }
}
