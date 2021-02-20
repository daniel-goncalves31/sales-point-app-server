import { Controller } from '@/presentation/protocols/Controller'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { UpdatePurchaseItemModel } from '@/domain/models/purchase/UpdatePurchaseItemModel'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { UpdatePurchaseItemUseCase } from '@/domain/usecases/purchase/UpdatePurchaseItemUseCase'
import { log } from '@/presentation/helpers/log-helper'

export class UpdatePurchaseItemController implements Controller {
  constructor(
    private readonly validator: Validator<UpdatePurchaseItemModel>,
    private readonly updatePurchaseItemUseCase: UpdatePurchaseItemUseCase
  ) { }

  async handle(httpRequest: HttpRequest<UpdatePurchaseItemModel>): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body!)
      if (error) {
        return badRequest(error)
      }

      await this.updatePurchaseItemUseCase.update(httpRequest.body!)
      return noContent()
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
