import { UpdateServiceController } from './UpdateServiceController'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { UpdateServiceUseCase } from '@/domain/usecases/service/UpdateServiceUseCase'

const fakeHttpRequest: HttpRequest<ServiceModel> = {
  body: {
    id: 1,
    name: 'any_name',
    brand: 'any_brand',
  }
}

interface SutType {
  sut: UpdateServiceController
  validatorStub: MockProxy<Validator>
  updateServiceUseCaseStub: MockProxy<UpdateServiceUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const updateServiceUseCaseStub = mock<UpdateServiceUseCase>()

  const sut = new UpdateServiceController(
    validatorStub,
    updateServiceUseCaseStub
  )

  return {
    sut,
    validatorStub,
    updateServiceUseCaseStub
  }
}

describe('UpdateServiceController', () => {
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

  describe('UpdateServiceUseCase', () => {
    test('should call UpdateServiceUseCase with correct values', async () => {
      const { sut, updateServiceUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(updateServiceUseCaseStub.update).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(updateServiceUseCaseStub.update).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if UpdateServiceUseCase throws', async () => {
      const { sut, updateServiceUseCaseStub } = makeSut()
      updateServiceUseCaseStub.update.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
  })

  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(noContent())
  })
})
