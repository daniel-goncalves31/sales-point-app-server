/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@/presentation/protocols/Controller'
import { LoadServicesUseCase } from '@/domain/usecases/service/LoadServicesUseCase'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { serverError, ok } from '@/presentation/helpers/http-responses'
import { log } from '@/presentation/helpers/log-helper'

export class LoadServicesController implements Controller {
  constructor(private readonly loadServicesUseCase: LoadServicesUseCase) { }

  async handle(
    _httpRequest: HttpRequest
  ): Promise<HttpResponse<ServiceModel[] | Error>> {
    try {
      const services = await this.loadServicesUseCase.load()
      return ok(services)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
