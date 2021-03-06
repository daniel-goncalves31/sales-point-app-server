import { Controller } from '@/presentation/protocols/Controller'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { DeletePurchaseUseCase } from '@/domain/usecases/purchase/DeletePurchaseUseCase'
import { log } from '@/presentation/helpers/log-helper'

export class DeletePurchaseController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly deletePurchaseUseCaseStub: DeletePurchaseUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      await this.deletePurchaseUseCaseStub.delete(httpRequest.body.purchaseId)

      return noContent()
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
