import { DbUpdateSaleUseCase } from './DbUpdateSaleUseCase'
import { UpdateSaleModel } from '@/domain/models/sale/UpdateSaleModel'
import { MockProxy, mock } from 'jest-mock-extended'
import { UpdateSaleRepository } from '@/data/protocols/db/sale/UpdateSaleRepository'

interface SutType {
  sut: DbUpdateSaleUseCase
  updateSaleRepositoryStub: MockProxy<UpdateSaleRepository>
}

const fakeSale: UpdateSaleModel = {
  id: 1,
  userId: 'any_id',
  date: new Date()
}

const makeSut = (): SutType => {
  const updateSaleRepositoryStub = mock<UpdateSaleRepository>()
  const sut = new DbUpdateSaleUseCase(updateSaleRepositoryStub)

  return {
    sut,
    updateSaleRepositoryStub
  }
}

describe('DbUpdateSaleUseCase', () => {
  test('should call UpdateSaleRepository with correct value', async () => {
    const { sut, updateSaleRepositoryStub } = makeSut()

    await sut.update(fakeSale)

    expect(updateSaleRepositoryStub.update).toHaveBeenCalledWith(fakeSale)
    expect(updateSaleRepositoryStub.update).toHaveBeenCalledTimes(1)
  })
  test('should throw if UpdateSaleRepository throws', async () => {
    const { sut, updateSaleRepositoryStub } = makeSut()
    updateSaleRepositoryStub.update.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.update(fakeSale)

    await expect(promise).rejects.toThrow()
  })
})
