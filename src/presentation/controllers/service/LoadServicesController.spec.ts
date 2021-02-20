import { LoadServicesController } from './LoadServicesController'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoadServicesUseCase } from '@/domain/usecases/service/LoadServicesUseCase'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { serverError, ok } from '@/presentation/helpers/http-responses'
import { ServiceModel } from '@/domain/models/service/ServiceModel'

const fakeHttpRequest: HttpRequest = {
  body: null
}

const fakeService: ServiceModel = {
  id: 1,
  name: 'any_name',
  brand: 'any_brand',
}

const fakeArrServices: ServiceModel[] = [fakeService, fakeService, fakeService]

interface SutType {
  sut: LoadServicesController
  loadServicesUseCaseStub: MockProxy<LoadServicesUseCase>
}

const makeSut = (): SutType => {
  const loadServicesUseCaseStub = mock<LoadServicesUseCase>()
  loadServicesUseCaseStub.load.mockReturnValue(Promise.resolve(fakeArrServices))

  const sut = new LoadServicesController(loadServicesUseCaseStub)

  return {
    sut,
    loadServicesUseCaseStub
  }
}

describe('LoadServicesController', () => {
  test('should call LoadServicesUseCase with no values', async () => {
    const { sut, loadServicesUseCaseStub } = makeSut()

    await sut.handle(fakeHttpRequest)

    expect(loadServicesUseCaseStub.load).toHaveBeenCalledTimes(1)
  })
  test('should return 500 if LoadServicesUseCase throws', async () => {
    const { sut, loadServicesUseCaseStub } = makeSut()
    loadServicesUseCaseStub.load.mockImplementationOnce(() => {
      throw new Error()
    })
    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(serverError())
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(ok(fakeArrServices))
  })
})
