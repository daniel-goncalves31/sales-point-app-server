import { DbUpdatePurchaseItemUseCase } from './DbUpdatePurchaseItemUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { UpdatePurchaseItemRepository } from '@/data/protocols/db/purchase/UpdatePurchaseItemRepository'
import { UpdatePurchaseItemModel } from '@/domain/models/purchase/UpdatePurchaseItemModel'

const fakePurchaseItem: UpdatePurchaseItemModel = {
  id: 1,
  productId: 1,
  price: 1,
  quantity: 5,
}

interface SutType {
  sut: DbUpdatePurchaseItemUseCase
  updatePurchaseItemRepositoryStub: MockProxy<UpdatePurchaseItemRepository>
}

const makeSut = (): SutType => {
  const updatePurchaseItemRepositoryStub = mock<UpdatePurchaseItemRepository>()

  const sut = new DbUpdatePurchaseItemUseCase(updatePurchaseItemRepositoryStub)

  return {
    sut,
    updatePurchaseItemRepositoryStub
  }
}

describe('DbUpdatePurchaseItemUseCase', () => {
  test('should call UpdatePurchaseItemRepository with correct value', async () => {
    const { sut, updatePurchaseItemRepositoryStub } = makeSut()

    await sut.update(fakePurchaseItem)

    expect(updatePurchaseItemRepositoryStub.updateItem).toHaveBeenCalledWith(fakePurchaseItem)
    expect(updatePurchaseItemRepositoryStub.updateItem).toHaveBeenCalledTimes(1)
  })
  test('should throw if UpdatePurchaseItemRepository throws', async () => {
    const { sut, updatePurchaseItemRepositoryStub } = makeSut()
    updatePurchaseItemRepositoryStub.updateItem.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.update(fakePurchaseItem)

    await expect(promise).rejects.toThrow()
  })
})
