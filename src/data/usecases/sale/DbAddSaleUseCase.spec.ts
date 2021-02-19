import { MockProxy, mock } from 'jest-mock-extended'
import { SaleModel, SalePaymentType } from '@/domain/models/sale/SaleModel'

import { DbAddSaleUseCase } from './DbAddSaleUseCase'
import { InsertSaleRepository } from '../../protocols/db/sale/InsertSaleRepository'
import { NewSaleModel } from '@/domain/models/sale/NewSaleModel'

const fakeNewSale: NewSaleModel = {
  userId: 'any_id',
  total: 299,
  paymentType: SalePaymentType.MONEY,
  items: [
    {
      price: 2.99,
      productId: 1,
      quantity: 1
    },
    {
      price: 2.99,
      productId: 1,
      quantity: 1
    }
  ]
}

const fakeSaleModel: SaleModel = {
  id: 1,
  userId: 'user_id',
  total: 299,
  paymentType: SalePaymentType.MONEY,
  items: [
    {
      id: 1,
      price: 2.88,
      product: {} as any,
      quantity: 1,
      saleId: 1,
      purchasePrice: 2
    }
  ],
  date: new Date()
}

interface SutType {
  sut: DbAddSaleUseCase
  insertSaleRepositoryStub: MockProxy<InsertSaleRepository>
}

const makeSut = (): SutType => {
  const insertSaleRepositoryStub = mock<InsertSaleRepository>()
  insertSaleRepositoryStub.insert.mockReturnValue(
    Promise.resolve(fakeSaleModel)
  )

  const sut = new DbAddSaleUseCase(insertSaleRepositoryStub)

  return {
    sut,
    insertSaleRepositoryStub
  }
}

describe('DbAddSaleUseCase', () => {
  test('should call InsertSaleRepository with correct values', async () => {
    const { sut, insertSaleRepositoryStub } = makeSut()

    await sut.add(fakeNewSale)

    expect(insertSaleRepositoryStub.insert).toHaveBeenCalledWith(fakeNewSale)
    expect(insertSaleRepositoryStub.insert).toHaveBeenCalledTimes(1)
  })
  test('should throw if InsertSaleRepository throws', async () => {
    const { sut, insertSaleRepositoryStub } = makeSut()
    insertSaleRepositoryStub.insert.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.add(fakeNewSale)

    await expect(promise).rejects.toThrow()
  })
  test('should return an SaleModel on success', async () => {
    const { sut } = makeSut()

    const sale = await sut.add(fakeNewSale)

    expect(sale).toEqual(fakeSaleModel)
  })
})
