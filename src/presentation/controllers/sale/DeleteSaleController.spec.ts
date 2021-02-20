import { DeleteSaleController } from './DeleteSaleController'
import { mock, MockProxy } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { DeleteSaleUseCase } from '@/domain/usecases/sale/DeleteSaleUseCase'

const fakeHttpRequest: HttpRequest = {
  body: {
    saleId: 1
  }
}

interface SutType {
  sut: DeleteSaleController
  validatorStub: MockProxy<Validator>
  deleteSaleUseCaseStub: MockProxy<DeleteSaleUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const deleteSaleUseCaseStub = mock<DeleteSaleUseCase>()

  const sut = new DeleteSaleController(validatorStub, deleteSaleUseCaseStub)

  return {
    sut,
    validatorStub,
    deleteSaleUseCaseStub
  }
}

describe('DeleteSaleController', () => {
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

  describe('DeleteSaleUseCase', () => {
    test('should call DeleteSaleUseCase with correct values', async () => {
      const { sut, deleteSaleUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(deleteSaleUseCaseStub.delete).toHaveBeenCalledWith(
        fakeHttpRequest.body.saleId
      )
      expect(deleteSaleUseCaseStub.delete).toHaveBeenCalledTimes(1)
    })

    test('should return 500 if AddSaleUseCase throws', async () => {
      const { sut, deleteSaleUseCaseStub } = makeSut()
      deleteSaleUseCaseStub.delete.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })

    test('should return 204 if AddSaleUseCase succeeds', async () => {
      const { sut } = makeSut()

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(noContent())
    })
  })
})
