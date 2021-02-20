import { DbAddPurchaseUseCase } from './DbAddPurchaseUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { InsertPurchaseRepository } from '../../protocols/db/purchase/InsertPurchaseRepository'
import { NewPurchaseModel } from '@/domain/models/purchase/NewPurchaseModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'

const fakeUserId = 'b3d7e8d8-9a9f-46fa-9748-92b5cfef7301'

const fakeNewPurchase: NewPurchaseModel = {
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

const fakePurchaseModel: PurchaseModel = {
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
  sut: DbAddPurchaseUseCase
  insertPurchaseRepositoryStub: MockProxy<InsertPurchaseRepository>
}

const makeSut = (): SutType => {
  const insertPurchaseRepositoryStub = mock<InsertPurchaseRepository>()
  insertPurchaseRepositoryStub.insert.mockReturnValue(
    Promise.resolve(fakePurchaseModel)
  )

  const sut = new DbAddPurchaseUseCase(insertPurchaseRepositoryStub)

  return {
    sut,
    insertPurchaseRepositoryStub
  }
}

describe('DbAddPurchaseUseCase', () => {
  test('should call InsertPurchaseRepository with correct values', async () => {
    const { sut, insertPurchaseRepositoryStub } = makeSut()

    await sut.add(fakeNewPurchase, fakeUserId)

    expect(insertPurchaseRepositoryStub.insert).toHaveBeenCalledWith(
      fakeNewPurchase,
      fakeUserId
    )
    expect(insertPurchaseRepositoryStub.insert).toHaveBeenCalledTimes(1)
  })
  test('should throw if InsertPurchaseRepository throws', async () => {
    const { sut, insertPurchaseRepositoryStub } = makeSut()
    insertPurchaseRepositoryStub.insert.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.add(fakeNewPurchase, fakeUserId)

    await expect(promise).rejects.toThrow()
  })
  test('should return an PurchaseModel on success', async () => {
    const { sut } = makeSut()

    const purchase = await sut.add(fakeNewPurchase, fakeUserId)

    expect(purchase).toEqual(fakePurchaseModel)
  })
})
