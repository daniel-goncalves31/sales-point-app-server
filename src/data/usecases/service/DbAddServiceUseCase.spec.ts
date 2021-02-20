import { DbAddServiceUseCase } from './DbAddServiceUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { NewServiceModel } from '@/domain/models/service/NewServiceModel'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { InsertServiceRepository } from '@/data/protocols/db/service/InsertServiceRepository'

const fakeNewService: NewServiceModel = {
  name: 'any_name',
  brand: 'any_brand',
}

const fakeService: ServiceModel = {
  id: 1,
  name: 'any_name',
  brand: 'any_brand',
}

interface SutType {
  sut: DbAddServiceUseCase
  insertServiceRepositoryStub: MockProxy<InsertServiceRepository>
}

const makeSut = (): SutType => {
  const insertServiceRepositoryStub = mock<InsertServiceRepository>()
  insertServiceRepositoryStub.insert.mockReturnValue(
    Promise.resolve(fakeService)
  )

  const sut = new DbAddServiceUseCase(insertServiceRepositoryStub)

  return {
    sut,
    insertServiceRepositoryStub
  }
}

describe('DbAddServiceUseCase', () => {
  test('should call InsertServiceRepository with correct values', async () => {
    const { sut, insertServiceRepositoryStub } = makeSut()

    await sut.add(fakeNewService)

    expect(insertServiceRepositoryStub.insert).toHaveBeenCalledWith(
      fakeNewService
    )
    expect(insertServiceRepositoryStub.insert).toHaveBeenCalledTimes(1)
  })
  test('should throw if InsertServiceRepository throws', async () => {
    const { sut, insertServiceRepositoryStub } = makeSut()
    insertServiceRepositoryStub.insert.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.add(fakeNewService)

    await expect(promise).rejects.toThrow()
  })
  test('should return an ServiceModel on success', async () => {
    const { sut } = makeSut()

    const res = await sut.add(fakeNewService)

    expect(res).toEqual(fakeService)
  })
})
