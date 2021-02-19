import { AddUserUseCase } from '@/domain/usecases/user/AddUserUseCase'
import { Controller } from '@/presentation/protocols/Controller'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import {
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'
import { log } from '@/presentation/helpers/log-helper'

export class AddUserController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly addUserUseCase: AddUserUseCase
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const user = await this.addUserUseCase.add(httpRequest.body)
      return ok(user)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
