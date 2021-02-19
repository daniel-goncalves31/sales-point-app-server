import { AddProductUseCase } from '@/domain/usecases/product/AddProductUseCase'
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

export class AddProductController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addProductUseCase: AddProductUseCase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const body = httpRequest.body
      const error = this.validator.validate({...body.product, purchasePrice: body.purchasePrice})
      if (error) {
        return badRequest(error)
      }
      const product = await this.addProductUseCase.add(httpRequest.body, httpRequest.currentUser!.id)
      return ok(product)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
