import { AddServiceController } from './AddServiceController'
import { MockProxy, mock } from 'jest-mock-extended'
import { NewServiceModel } from '@/domain/models/service/NewServiceModel'
import { AddServiceUseCase } from '@/domain/usecases/service/AddServiceUseCase'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'

const fakeService: ServiceModel = {
  id: 1,
  name: 'any_name',
  brand: 'any_brand',
}


const fakeHttpRequest: HttpRequest<NewServiceModel> = {
  body: {
    name: 'any_name',
    brand: 'any_brand',
  },
}

interface SutType {
  sut: AddServiceController
  validatorStub: MockProxy<Validator>
  addServiceUseCaseStub: MockProxy<AddServiceUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const addServiceUseCaseStub = mock<AddServiceUseCase>()
  addServiceUseCaseStub.add.mockReturnValue(Promise.resolve(fakeService))

  const sut = new AddServiceController(validatorStub, addServiceUseCaseStub)

  return {
    sut,
    validatorStub,
    addServiceUseCaseStub
  }
}

describe('AddServiceController', () => {
  describe('Validator', () => {
    test('should call validator with correct values', async () => {
      const { sut, validatorStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(validatorStub.validate).toHaveBeenCalledWith(fakeHttpRequest.body)
      expect(validatorStub.validate).toHaveBeenCalledTimes(1)
    })
    test('should return 400 if validator returns an error', async () => {
      const { sut, validatorStub } = makeSut()
      validatorStub.validate.mockReturnValueOnce(new Error())

      const res = await sut.handle(fakeHttpRequest)
      expect(res).toEqual(badRequest(new Error()))
    })
  })

  describe('AddServiceUseCase', () => {
    test('should call AddServiceUseCase with correct values', async () => {
      const { sut, addServiceUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(addServiceUseCaseStub.add).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(addServiceUseCaseStub.add).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if AddServiceUseCase throws', async () => {
      const { sut, addServiceUseCaseStub } = makeSut()
      addServiceUseCaseStub.add.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(ok(fakeService))
  })
})
