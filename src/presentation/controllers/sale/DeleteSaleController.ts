import { Controller } from '@/presentation/protocols/Controller'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { DeleteSaleUseCase } from '@/domain/usecases/sale/DeleteSaleUseCase'
import { log } from '@/presentation/helpers/log-helper'

export class DeleteSaleController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly deleteSaleUseCaseStub: DeleteSaleUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      await this.deleteSaleUseCaseStub.delete(httpRequest.body.saleId)

      return noContent()
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
