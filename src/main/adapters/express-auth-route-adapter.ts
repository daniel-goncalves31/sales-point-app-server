import { Controller } from '@/presentation/protocols/Controller'
import { Request, Response } from 'express'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { AuthenticationModel } from '@/domain/models/user/AuthenticationModel'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { setAuthCookie } from '../helpers/set-auth-cookie-helper'

export const adaptAuthRoute = (constroller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const httpResponse: HttpResponse<AuthenticationModel> = await constroller.handle(
      httpRequest
    )

    if (httpResponse.status === 200) {
      setAuthCookie(res, httpResponse.body.accessToken)
      res.status(httpResponse.status).json(httpResponse.body.user)
    } else if (httpResponse.status > 200 && httpResponse.status < 300) {
      res.status(httpResponse.status).json(httpResponse.body)
    } else {
      res.status(httpResponse.status).json({
        error: (httpResponse.body as any).message
      })
    }
  }
}
