import { DbLoadServicesUseCase } from './DbLoadServicesUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoadServicesRepository } from '@/data/protocols/db/service/LoadServicesRepository'
import { ServiceModel } from '@/domain/models/service/ServiceModel'

const fakeService: ServiceModel = {
  id: 1,
  name: 'any_name',
  brand: 'any_brand',
}

const fakeArrServices: ServiceModel[] = [fakeService, fakeService, fakeService]

interface SutType {
  sut: DbLoadServicesUseCase
  loadServicesRepositoryStub: MockProxy<LoadServicesRepository>
}

const makeSut = (): SutType => {
  const loadServicesRepositoryStub = mock<LoadServicesRepository>()
  loadServicesRepositoryStub.getAllServices.mockReturnValue(
    Promise.resolve(fakeArrServices)
  )

  const sut = new DbLoadServicesUseCase(loadServicesRepositoryStub)

  return {
    sut,
    loadServicesRepositoryStub
  }
}

describe('DbLoadServicesUseCase', () => {
  test('should call LoadServicesRepository', async () => {
    const { sut, loadServicesRepositoryStub } = makeSut()

    await sut.load()

    expect(loadServicesRepositoryStub.getAllServices).toBeCalledTimes(1)
  })
  test('should throw if LoadServicesRepository throws', async () => {
    const { sut, loadServicesRepositoryStub } = makeSut()
    loadServicesRepositoryStub.getAllServices.mockImplementationOnce(() => {
      throw new Error()
    })

    const res = sut.load()

    await expect(res).rejects.toThrow()
  })
  test('should return an ServiceModel array on success', async () => {
    const { sut } = makeSut()

    const services = await sut.load()

    expect(services).toEqual(fakeArrServices)
  })
})
