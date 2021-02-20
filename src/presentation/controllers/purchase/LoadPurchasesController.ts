import { Controller } from '@/presentation/protocols/Controller'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { LoadPurchaseParamsModel } from '@/domain/models/purchase/LoadPurchaseParamsModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'
import { LoadPurchasesUseCase } from '@/domain/usecases/purchase/LoadPurchasesUseCase'
import { log } from '@/presentation/helpers/log-helper'

export class LoadPurchasesController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly loadPurchasesUseCase: LoadPurchasesUseCase
  ) {}

  async handle (
    httpRequest: HttpRequest<any, LoadPurchaseParamsModel>
  ): Promise<HttpResponse<PurchaseModel[] | Error>> {
    try {
      const error = this.validator.validate(httpRequest.params)
      if (error) {
        return badRequest(error)
      }
      const purchases = await this.loadPurchasesUseCase.load(
        httpRequest.params!
      )
      return ok(purchases)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
