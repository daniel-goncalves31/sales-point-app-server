import { MockProxy, mock } from 'jest-mock-extended'

import { DbDeleteSaleItemUseCase } from './DbDeleteSaleItemUsecase'
import { DeleteSaleItemRepository } from '@/data/protocols/db/sale/DeleteSaleItemRepository'

const fakeSaleItemId = 1

interface SutType {
  sut: DbDeleteSaleItemUseCase
  deleteSaleItemRepositoryStub: MockProxy<DeleteSaleItemRepository>
}

const makeSut = (): SutType => {
  const deleteSaleItemRepositoryStub = mock<DeleteSaleItemRepository>()

  const sut = new DbDeleteSaleItemUseCase(deleteSaleItemRepositoryStub)

  return {
    sut,
    deleteSaleItemRepositoryStub
  }
}

describe('DbDeleteSaleItemUseCase', () => {
  test('should call DeleteSaleItemRepository with correct values', async () => {
    const { sut, deleteSaleItemRepositoryStub } = makeSut()

    await sut.delete(fakeSaleItemId)

    expect(deleteSaleItemRepositoryStub.removeItem).toHaveBeenCalledWith(fakeSaleItemId)
    expect(deleteSaleItemRepositoryStub.removeItem).toHaveBeenCalledTimes(1)
  })
  test('should throw if DeleteSaleItemRepository throws', async () => {
    const { sut, deleteSaleItemRepositoryStub } = makeSut()
    deleteSaleItemRepositoryStub.removeItem.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.delete(fakeSaleItemId)

    await expect(promise).rejects.toThrow()
  })
})
