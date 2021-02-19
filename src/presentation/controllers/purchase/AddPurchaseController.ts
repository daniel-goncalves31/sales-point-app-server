import { Controller } from '@/presentation/protocols/Controller'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { NewPurchaseModel } from '@/domain/models/purchase/NewPurchaseModel'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'
import {
  forbidden,
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'
import { AccessDeniedError } from '@/presentation/protocols/errors'
import { Validator } from '@/presentation/protocols/Validator'
import { AddPurchaseUseCase } from '@/domain/usecases/purchase/AddPurchaseUseCase'
import { log } from '@/presentation/helpers/log-helper'

export class AddPurchaseController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addPurchaseUseCase: AddPurchaseUseCase
  ) {}

  async handle (
    httpRequest: HttpRequest<NewPurchaseModel>
  ): Promise<HttpResponse<PurchaseModel | Error>> {
    try {
      if (!httpRequest.currentUser || !httpRequest.currentUser.id) {
        return forbidden(new AccessDeniedError())
      }
      const error = this.validator.validate(httpRequest.body?.items)
      if (error) {
        return badRequest(error)
      }

      const purchase = await this.addPurchaseUseCase.add(
        httpRequest.body!,
        httpRequest.currentUser.id
      )

      return ok(purchase)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
