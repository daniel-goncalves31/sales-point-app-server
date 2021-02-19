import { MockProxy, mock } from 'jest-mock-extended'
import {
  badRequest,
  noContent,
  serverError
} from '@/presentation/helpers/http-responses'

import { DeleteSaleItemController } from './DeleteSaleItemController'
import { DeleteSaleItemUseCase } from '@/domain/usecases/sale/DeleteSaleItemUseCase'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { Validator } from '@/presentation/protocols/Validator'

const fakeHttpRequest: HttpRequest = {
  body: {
    id: 1
  }
}

interface SutType {
  sut: DeleteSaleItemController
  validatorStub: MockProxy<Validator>
  deleteSaleItemUseCaseStub: MockProxy<DeleteSaleItemUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const deleteSaleItemUseCaseStub = mock<DeleteSaleItemUseCase>()

  const sut = new DeleteSaleItemController(validatorStub, deleteSaleItemUseCaseStub)

  return {
    sut,
    validatorStub,
    deleteSaleItemUseCaseStub
  }
}

describe('DeleteSaleItemController', () => {
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

  describe('DeleteSaleItemUseCase', () => {
    test('should call DeleteSaleItemUseCase with correct values', async () => {
      const { sut, deleteSaleItemUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(deleteSaleItemUseCaseStub.delete).toHaveBeenCalledWith(
        fakeHttpRequest.body?.id
      )
      expect(deleteSaleItemUseCaseStub.delete).toHaveBeenCalledTimes(1)
    })

    test('should return 500 if AddSaleItemUseCase throws', async () => {
      const { sut, deleteSaleItemUseCaseStub } = makeSut()
      deleteSaleItemUseCaseStub.delete.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })

    test('should return 204 if AddSaleItemUseCase succeeds', async () => {
      const { sut } = makeSut()

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(noContent())
    })
  })
})
