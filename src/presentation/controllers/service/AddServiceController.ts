import { AddServiceUseCase } from '@/domain/usecases/service/AddServiceUseCase'
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

export class AddServiceController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly addServiceUseCase: AddServiceUseCase
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const service = await this.addServiceUseCase.add(httpRequest.body)
      return ok(service)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
