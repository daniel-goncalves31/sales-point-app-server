import { DbDeleteServiceUseCase } from './DbDeleteServiceUseCase'
import { DeleteServiceModel } from '@/domain/models/service/DeleteServiceModel'
import { MockProxy, mock } from 'jest-mock-extended'
import { DeleteServiceRepository } from '@/data/protocols/db/service/DeleteServiceRepository'

const fakeDeleteModel: DeleteServiceModel = {
  id: 1
}

interface SutType {
  sut: DbDeleteServiceUseCase
  deleteServiceRepositoryStub: MockProxy<DeleteServiceRepository>
}

const makeSut = (): SutType => {
  const deleteServiceRepositoryStub = mock<DeleteServiceRepository>()

  const sut = new DbDeleteServiceUseCase(deleteServiceRepositoryStub)

  return {
    sut,
    deleteServiceRepositoryStub
  }
}

describe('DbDeleteServiceUseCase', () => {
  test('should call DeleteServiceRepository with correct value', async () => {
    const { sut, deleteServiceRepositoryStub } = makeSut()

    await sut.delete(fakeDeleteModel)

    expect(deleteServiceRepositoryStub.remove).toHaveBeenCalledWith(
      fakeDeleteModel
    )
    expect(deleteServiceRepositoryStub.remove).toHaveBeenCalledTimes(1)
  })
  test('should throw if DeleteServiceRepository throws', async () => {
    const { sut, deleteServiceRepositoryStub } = makeSut()
    deleteServiceRepositoryStub.remove.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.delete(fakeDeleteModel)

    await expect(promise).rejects.toThrow()
  })
})
