import { UpdateSaleController } from './UpdateSaleController'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { UpdateSaleModel } from '@/domain/models/sale/UpdateSaleModel'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { UpdateSaleUseCase } from '@/domain/usecases/sale/UpdateSaleUseCase'

const fakeHttpRequest: HttpRequest<UpdateSaleModel> = {
  body: {
    id: 1,
    userId: 'user_id',
    date: new Date()
  }
}

interface SutType {
  sut: UpdateSaleController
  validatorStub: MockProxy<Validator>
  updateSaleUseCaseStub: MockProxy<UpdateSaleUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const updateSaleUseCaseStub = mock<UpdateSaleUseCase>()

  const sut = new UpdateSaleController(validatorStub, updateSaleUseCaseStub)

  return {
    sut,
    validatorStub,
    updateSaleUseCaseStub
  }
}

describe('UpdateSaleController', () => {
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
  describe('UpdateSaleUseCase', () => {
    test('should call UpdateSaleUseCase with correct values', async () => {
      const { sut, updateSaleUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(updateSaleUseCaseStub.update).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(updateSaleUseCaseStub.update).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if UpdateProductUseCase throws', async () => {
      const { sut, updateSaleUseCaseStub } = makeSut()
      updateSaleUseCaseStub.update.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
    test('should return 200 on success', async () => {
      const { sut } = makeSut()

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(noContent())
    })
  })
})
