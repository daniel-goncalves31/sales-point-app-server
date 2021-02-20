import { Controller } from '@/presentation/protocols/Controller'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { NewSaleModel } from '@/domain/models/sale/NewSaleModel'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { SaleModel } from '@/domain/models/sale/SaleModel'
import {
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'
import { MissingParamError } from '@/presentation/protocols/errors'
import { Validator } from '@/presentation/protocols/Validator'
import { AddSaleUseCase } from '@/domain/usecases/sale/AddSaleUseCase'
import { log } from '@/presentation/helpers/log-helper'

export class AddSaleController implements Controller {
  constructor(
    private readonly validator: Validator,
    private readonly addSaleUseCase: AddSaleUseCase
  ) { }

  async handle(
    httpRequest: HttpRequest<NewSaleModel>
  ): Promise<HttpResponse<SaleModel | Error>> {
    try {
      if (!httpRequest.body?.total) {
        return badRequest(new MissingParamError('total'))
      }
      if (!httpRequest.body?.userId) {
        return badRequest(new MissingParamError('userId'))
      }
      const error = this.validator.validate(httpRequest.body?.items)
      if (error) {
        return badRequest(error)
      }

      const sale = await this.addSaleUseCase.add(
        httpRequest.body!
      )

      return ok(sale)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
