import { MockProxy, mock } from 'jest-mock-extended'
import { ProductModel, ProductStatus } from '@/domain/models/product/ProductModel'
import {
  badRequest,
  noContent,
  serverError
} from '@/presentation/helpers/http-responses'

import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { UpdateProductController } from './UpdateProductController'
import { UpdateProductUseCase } from '@/domain/usecases/product/UpdateProductUseCase'
import { Validator } from '@/presentation/protocols/Validator'

const fakeHttpRequest: HttpRequest<ProductModel> = {
  body: {
    id: 1,
    name: 'any_name',
    brand: 'any_brand',
    price: 1,
    quantity: 5,
    minQuantity: 3,
    status: ProductStatus.ACTIVE
  }
}

interface SutType {
  sut: UpdateProductController
  validatorStub: MockProxy<Validator>
  updateProductUseCaseStub: MockProxy<UpdateProductUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const updateProductUseCaseStub = mock<UpdateProductUseCase>()

  const sut = new UpdateProductController(
    validatorStub,
    updateProductUseCaseStub
  )

  return {
    sut,
    validatorStub,
    updateProductUseCaseStub
  }
}

describe('UpdateProductController', () => {
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

  describe('UpdateProductUseCase', () => {
    test('should call UpdateProductUseCase with correct values', async () => {
      const { sut, updateProductUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(updateProductUseCaseStub.update).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(updateProductUseCaseStub.update).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if UpdateProductUseCase throws', async () => {
      const { sut, updateProductUseCaseStub } = makeSut()
      updateProductUseCaseStub.update.mockImplementationOnce(() => {
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
