import { MockProxy, mock } from 'jest-mock-extended'
import { ProductModel, ProductStatus } from '@/domain/models/product/ProductModel'

import { DbUpdateProductUseCase } from './DbUpdateProductUseCase'
import { UpdateProductRepository } from '@/data/protocols/db/product/UpdateProductRepository'

const fakeProduct: ProductModel = {
  id: 1,
  name: 'any_name',
  brand: 'any_brand',
  price: 1,
  quantity: 2,
  minQuantity: 1,
  status: ProductStatus.ACTIVE
}

interface SutType {
  sut: DbUpdateProductUseCase
  updateProductRepositoryStub: MockProxy<UpdateProductRepository>
}

const makeSut = (): SutType => {
  const updateProductRepositoryStub = mock<UpdateProductRepository>()

  const sut = new DbUpdateProductUseCase(updateProductRepositoryStub)

  return {
    sut,
    updateProductRepositoryStub
  }
}

describe('DbUpdateProductUseCase', () => {
  test('should call UpdateProductRepository with correct value', async () => {
    const { sut, updateProductRepositoryStub } = makeSut()

    await sut.update(fakeProduct)

    expect(updateProductRepositoryStub.update).toHaveBeenCalledWith(fakeProduct)
    expect(updateProductRepositoryStub.update).toHaveBeenCalledTimes(1)
  })
  test('should throw if UpdateProductRepository throws', async () => {
    const { sut, updateProductRepositoryStub } = makeSut()
    updateProductRepositoryStub.update.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.update(fakeProduct)

    await expect(promise).rejects.toThrow()
  })
})
