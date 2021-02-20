/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@/presentation/protocols/Controller'
import { LoadProductsUseCase } from '@/domain/usecases/product/LoadProductsUseCase'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { serverError, ok } from '@/presentation/helpers/http-responses'
import { log } from '@/presentation/helpers/log-helper'

export class LoadProductsController implements Controller {
  constructor (private readonly loadProductsUseCase: LoadProductsUseCase) {}

  async handle (
    _httpRequest: HttpRequest
  ): Promise<HttpResponse<ProductModel[] | Error>> {
    try {
      const products = await this.loadProductsUseCase.load()
      return ok(products)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
