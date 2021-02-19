import {
  badRequest,
  noContent,
  serverError
} from '@/presentation/helpers/http-responses'

import { Controller } from '@/presentation/protocols/Controller'
import { DeleteSaleItemUseCase } from '@/domain/usecases/sale/DeleteSaleItemUseCase'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { Validator } from '@/presentation/protocols/Validator'
import { log } from '@/presentation/helpers/log-helper'

export class DeleteSaleItemController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly deleteSaleItemUseCaseStub: DeleteSaleItemUseCase
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      await this.deleteSaleItemUseCaseStub.delete(httpRequest.body?.id)

      return noContent()
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
