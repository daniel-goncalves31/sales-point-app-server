import { Controller } from '@/presentation/protocols/Controller'
import { Request, Response } from 'express'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { UserModel } from '@/domain/models/user/UserModel'

interface IRequest extends Request {
  user?: UserModel
}

export const adaptRoute = (constroller: Controller) => {
  return async (req: IRequest, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      currentUser: req.user,
      params: req.query
    }

    const httpResponse = await constroller.handle(httpRequest)
    if (httpResponse.status >= 200 && httpResponse.status <= 299) {
      res.status(httpResponse.status).json(httpResponse.body)
    } else {
      res.status(httpResponse.status).json({
        error: httpResponse.body.message
      })
    }
  }
}
