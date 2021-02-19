import { AddPurchaseController } from './AddPurchaseController'
import {
  forbidden,
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'
import { AccessDeniedError } from '@/presentation/protocols/errors'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { NewPurchaseModel } from '@/domain/models/purchase/NewPurchaseModel'
import { AddPurchaseUseCase } from '@/domain/usecases/purchase/AddPurchaseUseCase'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'

const fakeHttpRequest: HttpRequest<NewPurchaseModel> = {
  currentUser: { id: 'b3d7e8d8-9a9f-46fa-9748-92b5cfef7301' } as any,
  body: {
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

const fakePurchaseModel: PurchaseModel = {
  id: 1,
  userId: 'user_id',
  items: [
    {
      id: 1,
      price: 2.88,
      product: {} as any,
      quantity: 1,
      purchaseId: 1
    }
  ],
  date: new Date()
}

interface SutType {
  sut: AddPurchaseController
  validatorStub: MockProxy<Validator>
  addPurchaseUseCaseStub: MockProxy<AddPurchaseUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const addPurchaseUseCaseStub = mock<AddPurchaseUseCase>()
  addPurchaseUseCaseStub.add.mockReturnValue(Promise.resolve(fakePurchaseModel))

  const sut = new AddPurchaseController(validatorStub, addPurchaseUseCaseStub)

  return {
    sut,
    validatorStub,
    addPurchaseUseCaseStub
  }
}

describe('AddPurchaseController', () => {
  describe('Current User', () => {
    test('should be authenticated', async () => {
      const { sut } = makeSut()

      let res = await sut.handle({})
      expect(res).toEqual(forbidden(new AccessDeniedError()))

      res = await sut.handle({ currentUser: {} as any })
      expect(res).toEqual(forbidden(new AccessDeniedError()))
    })
  })

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

  describe('AddPurchaseUseCase', () => {
    test('should call AddProductUseCase with correct values', async () => {
      const { sut, addPurchaseUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(addPurchaseUseCaseStub.add).toHaveBeenCalledWith(
        fakeHttpRequest.body,
        fakeHttpRequest.currentUser?.id
      )
      expect(addPurchaseUseCaseStub.add).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if AddPurchaseUseCase throws', async () => {
      const { sut, addPurchaseUseCaseStub } = makeSut()
      addPurchaseUseCaseStub.add.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
    test('should return 200 if AddPurchaseUseCase returns a PurchaseModel', async () => {
      const { sut } = makeSut()

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(ok(fakePurchaseModel))
    })
  })
})
