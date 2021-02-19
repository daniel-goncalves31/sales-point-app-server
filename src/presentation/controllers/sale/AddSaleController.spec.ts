import { AddSaleController } from './AddSaleController'
import {
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { NewSaleModel } from '@/domain/models/sale/NewSaleModel'
import { AddSaleUseCase } from '@/domain/usecases/sale/AddSaleUseCase'
import { SaleModel, SalePaymentType } from '@/domain/models/sale/SaleModel'

const fakeHttpRequest: HttpRequest<NewSaleModel> = {
  body: {
    userId: 'b3d7e8d8-9a9f-46fa-9748-92b5cfef7301',
    paymentType: SalePaymentType.MONEY,
    total: 299,
    items: [
      {
        price: 2.99,
        productId: 1,
        quantity: 1
      },
      {
        price: 2.99,
        productId: 1,
        quantity: 1
      }
    ]
  }
}

const fakeSaleModel: SaleModel = {
  id: 1,
  userId: 'user_id',
  paymentType: SalePaymentType.MONEY,
  items: [
    {
      id: 1,
      price: 2.88,
      product: {} as any,
      quantity: 1,
      purchasePrice: 2
    }
  ],
  total: 299,
  date: new Date()
}

interface SutType {
  sut: AddSaleController
  validatorStub: MockProxy<Validator>
  addSaleUseCaseStub: MockProxy<AddSaleUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const addSaleUseCaseStub = mock<AddSaleUseCase>()
  addSaleUseCaseStub.add.mockReturnValue(Promise.resolve(fakeSaleModel))

  const sut = new AddSaleController(validatorStub, addSaleUseCaseStub)

  return {
    sut,
    validatorStub,
    addSaleUseCaseStub
  }
}

describe('AddSaleController', () => {

  describe('Validator', () => {
    test('should call validator with correct values', async () => {
      const { sut, validatorStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(validatorStub.validate).toHaveBeenCalledWith(
        fakeHttpRequest.body?.items
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

  describe('AddSaleUseCase', () => {
    test('should call AddProductUseCase with correct values', async () => {
      const { sut, addSaleUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(addSaleUseCaseStub.add).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(addSaleUseCaseStub.add).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if AddSaleUseCase throws', async () => {
      const { sut, addSaleUseCaseStub } = makeSut()
      addSaleUseCaseStub.add.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
    test('should return 200 if AddSaleUseCase returns a SaleModel', async () => {
      const { sut } = makeSut()

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(ok(fakeSaleModel))
    })
  })
})
