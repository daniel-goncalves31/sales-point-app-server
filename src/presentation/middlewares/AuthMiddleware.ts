import { Middleware } from '../protocols/Middleware'
import { HttpRequest } from '../protocols/HttpRequest'
import { HttpResponse } from '../protocols/HttpResponse'
import { forbidden, serverError, ok } from '../helpers/http-responses'
import { AccessDeniedError } from '../protocols/errors'
import { LoadUserByTokenUseCase } from '@/domain/usecases/user/LoadUserByToken'
import { AuthenticationModel } from '@/domain/models/user/AuthenticationModel'
import { log } from '@/presentation/helpers/log-helper'
import { UserRole } from '@/domain/models/user/UserModel'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserByTokenUseCase: LoadUserByTokenUseCase,
    private readonly allowedRoles?: UserRole[]
  ) {}

  async handle (
    httpRequest: HttpRequest
  ): Promise<HttpResponse<AuthenticationModel | Error>> {
    try {
      if (!httpRequest.headers['d794$7dsa99_dsadsa978lbipe$sdspp']) {
        return forbidden(new AccessDeniedError())
      }

      const user = await this.loadUserByTokenUseCase.load(
        httpRequest.headers['d794$7dsa99_dsadsa978lbipe$sdspp'],
        this.allowedRoles
      )
      if (!user) {
        return forbidden(new AccessDeniedError())
      }
      const accessToken = user.accessToken
      delete user.password
      delete user.accessToken
      return ok({ user, accessToken })
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
