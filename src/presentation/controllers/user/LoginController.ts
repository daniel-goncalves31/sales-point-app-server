import { LoginUseCase } from '@/domain/usecases/user/LoginUseCase'
import { Controller } from '@/presentation/protocols/Controller'
import { Validator } from '@/presentation/protocols/Validator'
import { LoginCredentialsModel } from '@/domain/models/user/LoginCredentialsModel'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { UserModel } from '@/domain/models/user/UserModel'
import {
  badRequest,
  serverError,
  ok,
  noContent
} from '@/presentation/helpers/http-responses'
import { log } from '@/presentation/helpers/log-helper'

export class LoginController implements Controller {
  constructor (
    private readonly validator: Validator<LoginCredentialsModel | undefined>,
    private readonly loginUseCase: LoginUseCase
  ) {}

  async handle (
    req: HttpRequest<LoginCredentialsModel>
  ): Promise<HttpResponse<UserModel | Error>> {
    try {
      const error = this.validator.validate(req.body)
      if (error) {
        return badRequest(error)
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const user = await this.loginUseCase.login(req.body!)

      if (!user) {
        return noContent()
      }

      return ok(user)
    } catch (error) {
      // console.error(error)
      log(error)
      return serverError()
    }
  }
}
