import { LoadSalesController } from './LoadSalesController'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { LoadSaleParamsModel } from '@/domain/models/sale/LoadSaleParamsModel'
import {
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'
import { LoadSalesUseCase } from '@/domain/usecases/sale/LoadSalesUseCase'
import { SaleModel, SalePaymentType } from '@/domain/models/sale/SaleModel'

const fakeHttpRequest: HttpRequest<any, LoadSaleParamsModel> = {
  params: {
    filter: 'any_value',
    date: 'any_date'
  }
}

const fakeSaleModel: SaleModel[] = [
  {
    id: 1,
    date: new Date(),
    items: [],
    total: 299,
    paymentType: SalePaymentType.MONEY,
  }
]

interface SutType {
  sut: LoadSalesController
  validatorStub: MockProxy<Validator>
  loadSalesUseCaseStub: MockProxy<LoadSalesUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const loadSalesUseCaseStub = mock<LoadSalesUseCase>()
  loadSalesUseCaseStub.load.mockReturnValue(Promise.resolve(fakeSaleModel))

  const sut = new LoadSalesController(validatorStub, loadSalesUseCaseStub)

  return {
    sut,
    validatorStub,
    loadSalesUseCaseStub
  }
}

describe('LoadSalesController', () => {
  describe('Validator', () => {
    test('should call validator with correct values', async () => {
      const { sut, validatorStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(validatorStub.validate).toHaveBeenCalledWith(
        fakeHttpRequest.params
      )
      expect(validatorStub.validate).toHaveBeenCalledTimes(1)
    })

    test('should return 400 if validator returns an error', async () => {
      const { sut, validatorStub } = makeSut()
      validatorStub.validate.mockReturnValueOnce(new Error())

      const res = await sut.handle(fakeHttpRequest)
      expect(res).toEqual(badRequest(new Error()))
    })
  })

  describe('LoadSalesUseCase', () => {
    test('should call LoadSalesUseCase with correct values', async () => {
      const { sut, loadSalesUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(loadSalesUseCaseStub.load).toHaveBeenCalledWith(
        fakeHttpRequest.params
      )
      expect(loadSalesUseCaseStub.load).toHaveBeenCalledTimes(1)
    })

    test('should return 500 if LoadSalesUseCase throws', async () => {
      const { sut, loadSalesUseCaseStub } = makeSut()
      loadSalesUseCaseStub.load.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })

    test('should return 200 if LoadSalesUseCase returns an array of SaleModel', async () => {
      const { sut } = makeSut()

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(ok(fakeSaleModel))
    })
  })
})
