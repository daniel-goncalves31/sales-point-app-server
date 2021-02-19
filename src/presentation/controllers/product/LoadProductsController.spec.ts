import { MockProxy, mock } from 'jest-mock-extended'
import { ProductModel, ProductStatus } from '@/domain/models/product/ProductModel'
import { ok, serverError } from '@/presentation/helpers/http-responses'

import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { LoadProductsController } from './LoadProductsController'
import { LoadProductsUseCase } from '@/domain/usecases/product/LoadProductsUseCase'

const fakeHttpRequest: HttpRequest = {
  body: null
}

const fakeProduct: ProductModel = {
  id: 1,
  name: 'any_name',
  brand: 'any_brand',
  price: 1,
  quantity: 5,
  minQuantity: 3,
  status: ProductStatus.ACTIVE
}

const fakeArrProducts: ProductModel[] = [fakeProduct, fakeProduct, fakeProduct]

interface SutType {
  sut: LoadProductsController
  loadProductsUseCaseStub: MockProxy<LoadProductsUseCase>
}

const makeSut = (): SutType => {
  const loadProductsUseCaseStub = mock<LoadProductsUseCase>()
  loadProductsUseCaseStub.load.mockReturnValue(Promise.resolve(fakeArrProducts))

  const sut = new LoadProductsController(loadProductsUseCaseStub)

  return {
    sut,
    loadProductsUseCaseStub
  }
}

describe('LoadProductsController', () => {
  test('should call LoadProductsUseCase with no values', async () => {
    const { sut, loadProductsUseCaseStub } = makeSut()

    await sut.handle(fakeHttpRequest)

    expect(loadProductsUseCaseStub.load).toHaveBeenCalledTimes(1)
  })
  test('should return 500 if LoadProductsUseCase throws', async () => {
    const { sut, loadProductsUseCaseStub } = makeSut()
    loadProductsUseCaseStub.load.mockImplementationOnce(() => {
      throw new Error()
    })
    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(serverError())
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(ok(fakeArrProducts))
  })
})
