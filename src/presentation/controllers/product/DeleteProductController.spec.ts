import { DeleteProductController } from './DeleteProductController'
import { DeleteProductModel } from '@/domain/models/product/DeleteProductModel'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { DeleteProductUseCase } from '@/domain/usecases/product/DeleteProductUseCase'

const fakeHttpRequest: HttpRequest<DeleteProductModel> = {
  body: {
    id: 1
  }
}

interface SutType {
  sut: DeleteProductController
  validatorStub: MockProxy<Validator>
  deleteProductUseCaseStub: MockProxy<DeleteProductUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const deleteProductUseCaseStub = mock<DeleteProductUseCase>()

  const sut = new DeleteProductController(
    validatorStub,
    deleteProductUseCaseStub
  )

  return {
    sut,
    validatorStub,
    deleteProductUseCaseStub
  }
}

describe('DeleteProductController', () => {
  describe('Validator', () => {
    test('should call validator with correct value', async () => {
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
  describe('DeleteProductUseCase', () => {
    test('should call DeleteProductUseCase with correct values', async () => {
      const { sut, deleteProductUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(deleteProductUseCaseStub.delete).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(deleteProductUseCaseStub.delete).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if AddProductUseCase throws', async () => {
      const { sut, deleteProductUseCaseStub } = makeSut()
      deleteProductUseCaseStub.delete.mockImplementationOnce(() => {
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
