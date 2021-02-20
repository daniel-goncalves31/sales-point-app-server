import { Controller } from '@/presentation/protocols/Controller'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { UserModel } from '@/domain/models/user/UserModel'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { log } from '@/presentation/helpers/log-helper'
import { UpdateUserUseCase } from '@/domain/usecases/user/UpdateUserUseCase'

export class UpdateUserController implements Controller {
  constructor(
    private readonly validator: Validator<UserModel>,
    private readonly updateUserUseCase: UpdateUserUseCase
  ) { }

  async handle(httpRequest: HttpRequest<UserModel>): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body!)
      if (error) {
        return badRequest(error)
      }

      await this.updateUserUseCase.update(httpRequest.body!)
      return noContent()
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
