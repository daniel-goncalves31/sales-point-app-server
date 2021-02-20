import { LoadPurchasesController } from './LoadPurchasesController'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { LoadPurchaseParamsModel } from '@/domain/models/purchase/LoadPurchaseParamsModel'
import {
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'
import { LoadPurchasesUseCase } from '@/domain/usecases/purchase/LoadPurchasesUseCase'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'

const fakeHttpRequest: HttpRequest<any, LoadPurchaseParamsModel> = {
  params: {
    filter: 'any_value',
    date: 'any_date'
  }
}

const fakePurchaseModel: PurchaseModel[] = [
  {
    id: 1,
    date: new Date(),
    items: []
  }
]

interface SutType {
  sut: LoadPurchasesController
  validatorStub: MockProxy<Validator>
  loadPurchasesUseCaseStub: MockProxy<LoadPurchasesUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const loadPurchasesUseCaseStub = mock<LoadPurchasesUseCase>()
  loadPurchasesUseCaseStub.load.mockReturnValue(
    Promise.resolve(fakePurchaseModel)
  )

  const sut = new LoadPurchasesController(
    validatorStub,
    loadPurchasesUseCaseStub
  )

  return {
    sut,
    validatorStub,
    loadPurchasesUseCaseStub
  }
}

describe('LoadPurchasesController', () => {
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

  describe('LoadPurchasesUseCase', () => {
    test('should call LoadPurchasesUseCase with correct values', async () => {
      const { sut, loadPurchasesUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(loadPurchasesUseCaseStub.load).toHaveBeenCalledWith(
        fakeHttpRequest.params
      )
      expect(loadPurchasesUseCaseStub.load).toHaveBeenCalledTimes(1)
    })

    test('should return 500 if LoadPurchasesUseCase throws', async () => {
      const { sut, loadPurchasesUseCaseStub } = makeSut()
      loadPurchasesUseCaseStub.load.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })

    test('should return 200 if LoadPurchasesUseCase returns an array of PurchaseModel', async () => {
      const { sut } = makeSut()

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(ok(fakePurchaseModel))
    })
  })
})
