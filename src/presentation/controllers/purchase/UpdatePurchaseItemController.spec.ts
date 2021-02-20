import { UpdatePurchaseItemController } from './UpdatePurchaseItemController'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { UpdatePurchaseItemUseCase } from '@/domain/usecases/purchase/UpdatePurchaseItemUseCase'
import { UpdatePurchaseItemModel } from '@/domain/models/purchase/UpdatePurchaseItemModel'

const fakeHttpRequest: HttpRequest<UpdatePurchaseItemModel> = {
  body: {
    id: 1,
    productId: 1,
    price: 1,
    quantity: 5,
  }
}

interface SutType {
  sut: UpdatePurchaseItemController
  validatorStub: MockProxy<Validator>
  updatePurchaseItemUseCaseStub: MockProxy<UpdatePurchaseItemUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const updatePurchaseItemUseCaseStub = mock<UpdatePurchaseItemUseCase>()

  const sut = new UpdatePurchaseItemController(
    validatorStub,
    updatePurchaseItemUseCaseStub
  )

  return {
    sut,
    validatorStub,
    updatePurchaseItemUseCaseStub
  }
}

describe('UpdatePurchaseItemController', () => {
  describe('Validator', () => {
    test('should call validator with correct values', async () => {
      const { sut, validatorStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(validatorStub.validate).toHaveBeenCalledWith(fakeHttpRequest.body)
      expect(validatorStub.validate).toHaveBeenCalledTimes(1)
    })
    test('should return 400 if validator returns an error', async () => {
      const { sut, validatorStub } = makeSut()
      validatorStub.validate.mockReturnValueOnce(new Error())

      const res = await sut.handle(fakeHttpRequest)
      expect(res).toEqual(badRequest(new Error()))
    })
  })

  describe('UpdatePurchaseItemUseCase', () => {
    test('should call UpdatePurchaseItemUseCase with correct values', async () => {
      const { sut, updatePurchaseItemUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(updatePurchaseItemUseCaseStub.update).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(updatePurchaseItemUseCaseStub.update).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if UpdatePurchaseItemUseCase throws', async () => {
      const { sut, updatePurchaseItemUseCaseStub } = makeSut()
      updatePurchaseItemUseCaseStub.update.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(noContent())
  })
})
