import { DbDeleteSaleUseCase } from './DbDeleteSaleUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { DeleteSaleRepository } from '@/data/protocols/db/sale/DeleteSaleRepository'

const fakeSaleId = 1

interface SutType {
  sut: DbDeleteSaleUseCase
  deleteSaleRepositoryStub: MockProxy<DeleteSaleRepository>
}

const makeSut = (): SutType => {
  const deleteSaleRepositoryStub = mock<DeleteSaleRepository>()

  const sut = new DbDeleteSaleUseCase(deleteSaleRepositoryStub)

  return {
    sut,
    deleteSaleRepositoryStub
  }
}

describe('DbDeleteSaleUseCase', () => {
  test('should call DeleteSaleRepository with correct values', async () => {
    const { sut, deleteSaleRepositoryStub } = makeSut()

    await sut.delete(fakeSaleId)

    expect(deleteSaleRepositoryStub.remove).toHaveBeenCalledWith(fakeSaleId)
    expect(deleteSaleRepositoryStub.remove).toHaveBeenCalledTimes(1)
  })
  test('should throw if DeleteSaleRepository throws', async () => {
    const { sut, deleteSaleRepositoryStub } = makeSut()
    deleteSaleRepositoryStub.remove.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.delete(fakeSaleId)

    await expect(promise).rejects.toThrow()
  })
})
