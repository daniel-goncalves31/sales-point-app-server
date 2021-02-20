import { DbUpdateServiceUseCase } from './DbUpdateServiceUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { UpdateServiceRepository } from '@/data/protocols/db/service/UpdateServiceRepository'
import { ServiceModel } from '@/domain/models/service/ServiceModel'

const fakeService: ServiceModel = {
  id: 1,
  name: 'any_name',
  brand: 'any_brand',
}

interface SutType {
  sut: DbUpdateServiceUseCase
  updateServiceRepositoryStub: MockProxy<UpdateServiceRepository>
}

const makeSut = (): SutType => {
  const updateServiceRepositoryStub = mock<UpdateServiceRepository>()

  const sut = new DbUpdateServiceUseCase(updateServiceRepositoryStub)

  return {
    sut,
    updateServiceRepositoryStub
  }
}

describe('DbUpdateServiceUseCase', () => {
  test('should call UpdateServiceRepository with correct value', async () => {
    const { sut, updateServiceRepositoryStub } = makeSut()

    await sut.update(fakeService)

    expect(updateServiceRepositoryStub.update).toHaveBeenCalledWith(fakeService)
    expect(updateServiceRepositoryStub.update).toHaveBeenCalledTimes(1)
  })
  test('should throw if UpdateServiceRepository throws', async () => {
    const { sut, updateServiceRepositoryStub } = makeSut()
    updateServiceRepositoryStub.update.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.update(fakeService)

    await expect(promise).rejects.toThrow()
  })
})
