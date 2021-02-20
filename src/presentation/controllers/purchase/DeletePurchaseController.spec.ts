import { DeletePurchaseController } from './DeletePurchaseController'
import { mock, MockProxy } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { DeletePurchaseUseCase } from '@/domain/usecases/purchase/DeletePurchaseUseCase'

const fakeHttpRequest: HttpRequest = {
  body: {
    purchaseId: 1
  }
}

interface SutType {
  sut: DeletePurchaseController
  validatorStub: MockProxy<Validator>
  deletePurchaseUseCaseStub: MockProxy<DeletePurchaseUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const deletePurchaseUseCaseStub = mock<DeletePurchaseUseCase>()

  const sut = new DeletePurchaseController(
    validatorStub,
    deletePurchaseUseCaseStub
  )

  return {
    sut,
    validatorStub,
    deletePurchaseUseCaseStub
  }
}

describe('DeletePurchaseController', () => {
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

  describe('DeletePurchaseUseCase', () => {
    test('should call DeletePurchaseUseCase with correct values', async () => {
      const { sut, deletePurchaseUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(deletePurchaseUseCaseStub.delete).toHaveBeenCalledWith(
        fakeHttpRequest.body.purchaseId
      )
      expect(deletePurchaseUseCaseStub.delete).toHaveBeenCalledTimes(1)
    })

    test('should return 500 if AddPurchaseUseCase throws', async () => {
      const { sut, deletePurchaseUseCaseStub } = makeSut()
      deletePurchaseUseCaseStub.delete.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })

    test('should return 204 if AddPurchaseUseCase succeeds', async () => {
      const { sut } = makeSut()

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(noContent())
    })
  })
})
