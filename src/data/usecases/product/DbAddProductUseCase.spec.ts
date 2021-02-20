import { MockProxy, mock } from 'jest-mock-extended'
import { ProductModel, ProductStatus } from '@/domain/models/product/ProductModel'

import { DbAddProductUseCase } from './DbAddProductUseCase'
import { InsertProductRepository } from '../../protocols/db/product/InsertProductRepository'
import { NewProductModel } from '@/domain/models/product/NewProductModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'

const fakeUserId = 'b3d7e8d8-9a9f-46fa-9748-92b5cfef7301'

const fakeNewProduct: NewProductModel = {
  product: {
    name: 'any_name',
    brand: 'any_brand',
    price: 1,
    quantity: 2,
    minQuantity: 1,
    status: ProductStatus.ACTIVE
  },
  purchasePrice: 2.99
}

const fakeProduct: ProductModel = {
  id: 1,
  name: 'any_name',
  brand: 'any_brand',
  price: 1,
  quantity: 2,
  minQuantity: 1,
  status: ProductStatus.ACTIVE
}

const fakePurchase: PurchaseModel = {
  id: 1,
  userId: 'user_id',
  items: [
    {
      id: 1,
      price: 2.88,
      product: {} as any,
      quantity: 1,
      purchaseId: 1
    }
  ],
  date: new Date()
}

interface SutType {
  sut: DbAddProductUseCase
  insertProductRepositoryStub: MockProxy<InsertProductRepository>
}

const makeSut = (): SutType => {
  const insertProductRepositoryStub = mock<InsertProductRepository>()
  insertProductRepositoryStub.insert.mockReturnValue(
    Promise.resolve({ product: fakeProduct, purchase: fakePurchase })
  )

  const sut = new DbAddProductUseCase(insertProductRepositoryStub)

  return {
    sut,
    insertProductRepositoryStub
  }
}

describe('DbAddProductUseCase', () => {
  test('should call InsertProductRepository with correct values', async () => {
    const { sut, insertProductRepositoryStub } = makeSut()

    await sut.add(fakeNewProduct, fakeUserId)

    expect(insertProductRepositoryStub.insert).toHaveBeenCalledWith(
      fakeNewProduct, fakeUserId
    )
    expect(insertProductRepositoryStub.insert).toHaveBeenCalledTimes(1)
  })
  test('should throw if InsertProductRepository throws', async () => {
    const { sut, insertProductRepositoryStub } = makeSut()
    insertProductRepositoryStub.insert.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.add(fakeNewProduct, fakeUserId)

    await expect(promise).rejects.toThrow()
  })
  test('should return an ProductModel on success', async () => {
    const { sut } = makeSut()

    const res = await sut.add(fakeNewProduct, fakeUserId)

    expect(res.product).toEqual(fakeProduct)
    expect(res.purchase).toEqual(fakePurchase)
  })
})
