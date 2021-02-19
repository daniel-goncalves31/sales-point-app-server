import { MockProxy, mock } from 'jest-mock-extended'
import { ProductModel, ProductStatus } from '@/domain/models/product/ProductModel'

import { DbLoadProductsUseCase } from './DbLoadProductsUseCase'
import { LoadProductsRepository } from '@/data/protocols/db/product/LoadProductsRepository'

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
  sut: DbLoadProductsUseCase
  loadProductsRepositoryStub: MockProxy<LoadProductsRepository>
}

const makeSut = (): SutType => {
  const loadProductsRepositoryStub = mock<LoadProductsRepository>()
  loadProductsRepositoryStub.getAllProducts.mockReturnValue(
    Promise.resolve(fakeArrProducts)
  )

  const sut = new DbLoadProductsUseCase(loadProductsRepositoryStub)

  return {
    sut,
    loadProductsRepositoryStub
  }
}

describe('DbLoadProductsUseCase', () => {
  test('should call LoadProductsRepository', async () => {
    const { sut, loadProductsRepositoryStub } = makeSut()

    await sut.load()

    expect(loadProductsRepositoryStub.getAllProducts).toBeCalledTimes(1)
  })
  test('should throw if LoadProductsRepository throws', async () => {
    const { sut, loadProductsRepositoryStub } = makeSut()
    loadProductsRepositoryStub.getAllProducts.mockImplementationOnce(() => {
      throw new Error()
    })

    const res = sut.load()

    await expect(res).rejects.toThrow()
  })
  test('should return an ProductModel array on success', async () => {
    const { sut } = makeSut()

    const products = await sut.load()

    expect(products).toEqual(fakeArrProducts)
  })
})
