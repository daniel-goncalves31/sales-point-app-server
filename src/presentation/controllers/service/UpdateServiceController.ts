import { Controller } from '@/presentation/protocols/Controller'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { UpdateServiceUseCase } from '@/domain/usecases/service/UpdateServiceUseCase'
import { log } from '@/presentation/helpers/log-helper'

export class UpdateServiceController implements Controller {
  constructor(
    private readonly validator: Validator<ServiceModel>,
    private readonly updateServiceUseCase: UpdateServiceUseCase
  ) { }

  async handle(httpRequest: HttpRequest<ServiceModel>): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body!)
      if (error) {
        return badRequest(error)
      }

      await this.updateServiceUseCase.update(httpRequest.body!)
      return noContent()
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
