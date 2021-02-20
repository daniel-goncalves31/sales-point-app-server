import { Controller } from '@/presentation/protocols/Controller'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { LoadSaleParamsModel } from '@/domain/models/sale/LoadSaleParamsModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'
import { LoadSalesUseCase } from '@/domain/usecases/sale/LoadSalesUseCase'
import { log } from '@/presentation/helpers/log-helper'

export class LoadSalesController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly loadSalesUseCase: LoadSalesUseCase
  ) {}

  async handle (
    httpRequest: HttpRequest<any, LoadSaleParamsModel>
  ): Promise<HttpResponse<SaleModel[] | Error>> {
    try {
      const error = this.validator.validate(httpRequest.params)
      if (error) {
        return badRequest(error)
      }
      const sales = await this.loadSalesUseCase.load(httpRequest.params!)
      return ok(sales)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
