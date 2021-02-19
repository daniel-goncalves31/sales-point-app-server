import { MockProxy, mock } from 'jest-mock-extended'
import { ProductModel, ProductStatus } from '@/domain/models/product/ProductModel'
import {
  badRequest,
  ok,
  serverError
} from '@/presentation/helpers/http-responses'

import { AddProductController } from './AddProductController'
import { AddProductUseCase } from '@/domain/usecases/product/AddProductUseCase'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { NewProductModel } from '@/domain/models/product/NewProductModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'
import { Validator } from '@/presentation/protocols/Validator'

const fakeProduct: ProductModel = {
  id: 1,
  name: 'any_name',
  brand: 'any_brand',
  price: 1,
  quantity: 5,
  minQuantity: 3,
  status: ProductStatus.ACTIVE
}

const fakePurchase: PurchaseModel = {
  id: 1,
  userId: 'any_id',
  date: new Date(),
  items: []
}

const fakeHttpRequest: HttpRequest<NewProductModel> = {
  body: {
    product: {
      name: 'any_name',
      brand: 'any_brand',
      price: 1,
      quantity: 5,
      minQuantity: 3,
      status: ProductStatus.ACTIVE
    },
    purchasePrice: 2.99
  },
  currentUser: {
    id: 'any_id'
  } as any
}

interface SutType {
  sut: AddProductController
  validatorStub: MockProxy<Validator>
  addProductUseCaseStub: MockProxy<AddProductUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const addProductUseCaseStub = mock<AddProductUseCase>()
  addProductUseCaseStub.add.mockReturnValue(Promise.resolve({ product: fakeProduct, purchase: fakePurchase }))

  const sut = new AddProductController(validatorStub, addProductUseCaseStub)

  return {
    sut,
    validatorStub,
    addProductUseCaseStub
  }
}

describe('AddProductController', () => {
  describe('Validator', () => {
    test('should call validator with correct values', async () => {
      const { sut, validatorStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(validatorStub.validate).toHaveBeenCalledWith({ ...fakeHttpRequest.body?.product, purchasePrice: fakeHttpRequest.body?.purchasePrice })
      expect(validatorStub.validate).toHaveBeenCalledTimes(1)
    })
    test('should return 400 if validator returns an error', async () => {
      const { sut, validatorStub } = makeSut()
      validatorStub.validate.mockReturnValueOnce(new Error())

      const res = await sut.handle(fakeHttpRequest)
      expect(res).toEqual(badRequest(new Error()))
    })
  })

  describe('AddProductUseCase', () => {
    test('should call AddProductUseCase with correct values', async () => {
      const { sut, addProductUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(addProductUseCaseStub.add).toHaveBeenCalledWith(
        fakeHttpRequest.body,
        fakeHttpRequest.currentUser?.id
      )
      expect(addProductUseCaseStub.add).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if AddProductUseCase throws', async () => {
      const { sut, addProductUseCaseStub } = makeSut()
      addProductUseCaseStub.add.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(ok({ product: fakeProduct, purchase: fakePurchase }))
  })
})
