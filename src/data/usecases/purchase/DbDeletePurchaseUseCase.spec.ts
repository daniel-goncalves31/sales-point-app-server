import { DbDeletePurchaseUseCase } from './DbDeletePurchaseUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { DeletePurchaseRepository } from '@/data/protocols/db/purchase/DeletePurchaseRepository'

const fakePurchaseId = 1

interface SutType {
  sut: DbDeletePurchaseUseCase
  deletePurchaseRepositoryStub: MockProxy<DeletePurchaseRepository>
}

const makeSut = (): SutType => {
  const deletePurchaseRepositoryStub = mock<DeletePurchaseRepository>()

  const sut = new DbDeletePurchaseUseCase(deletePurchaseRepositoryStub)

  return {
    sut,
    deletePurchaseRepositoryStub
  }
}

describe('DbDeletePurchaseUseCase', () => {
  test('should call DeletePurchaseRepository with correct values', async () => {
    const { sut, deletePurchaseRepositoryStub } = makeSut()

    await sut.delete(fakePurchaseId)

    expect(deletePurchaseRepositoryStub.remove).toHaveBeenCalledWith(
      fakePurchaseId
    )
    expect(deletePurchaseRepositoryStub.remove).toHaveBeenCalledTimes(1)
  })
  test('should throw if DeletePurchaseRepository throws', async () => {
    const { sut, deletePurchaseRepositoryStub } = makeSut()
    deletePurchaseRepositoryStub.remove.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.delete(fakePurchaseId)

    await expect(promise).rejects.toThrow()
  })
})
