import { Controller } from '@/presentation/protocols/Controller'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { UpdateProductUseCase } from '@/domain/usecases/product/UpdateProductUseCase'
import { log } from '@/presentation/helpers/log-helper'

export class UpdateProductController implements Controller {
  constructor (
    private readonly validator: Validator<ProductModel>,
    private readonly updateProductUseCase: UpdateProductUseCase
  ) {}

  async handle (httpRequest: HttpRequest<ProductModel>): Promise<HttpResponse> {
    try {
      const error = this.validator.validate(httpRequest.body!)
      if (error) {
        return badRequest(error)
      }

      await this.updateProductUseCase.update(httpRequest.body!)
      return noContent()
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
