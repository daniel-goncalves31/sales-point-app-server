import { DbLoadPurchasesUseCase } from './DbLoadPuchasesUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoadPurchasesRepository } from '@/data/protocols/db/purchase/LoadPurchasesRepository'
import { LoadPurchaseParamsModel } from '@/domain/models/purchase/LoadPurchaseParamsModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'

const fakePurchaseParams: LoadPurchaseParamsModel = {
  date: 'any_date',
  filter: 'any_value'
}

const fakePurchasesModel: PurchaseModel[] = [
  {
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
]

interface SutType {
  sut: DbLoadPurchasesUseCase
  loadPurchasesRepositoryStub: MockProxy<LoadPurchasesRepository>
}

const makeSut = (): SutType => {
  const loadPurchasesRepositoryStub = mock<LoadPurchasesRepository>()
  loadPurchasesRepositoryStub.getPurchases.mockReturnValue(
    Promise.resolve(fakePurchasesModel)
  )

  const sut = new DbLoadPurchasesUseCase(loadPurchasesRepositoryStub)

  return {
    sut,
    loadPurchasesRepositoryStub
  }
}

describe('DbLoadPurchasesUseCase', () => {
  test('should call LoadPurchasesRepository with correct values', async () => {
    const { sut, loadPurchasesRepositoryStub } = makeSut()

    await sut.load(fakePurchaseParams)

    expect(loadPurchasesRepositoryStub.getPurchases).toHaveBeenCalledWith(
      fakePurchaseParams
    )
    expect(loadPurchasesRepositoryStub.getPurchases).toHaveBeenCalledTimes(1)
  })

  test('should throw if LoadPurchasesRepository throws', async () => {
    const { sut, loadPurchasesRepositoryStub } = makeSut()
    loadPurchasesRepositoryStub.getPurchases.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.load(fakePurchaseParams)

    await expect(promise).rejects.toThrow()
  })

  test('should return an array of PurchaseModel on success', async () => {
    const { sut } = makeSut()

    const purchases = await sut.load(fakePurchaseParams)

    expect(purchases).toEqual(fakePurchasesModel)
  })
})
