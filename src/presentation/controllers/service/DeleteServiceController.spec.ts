import { DeleteServiceController } from './DeleteServiceController'
import { DeleteServiceModel } from '@/domain/models/service/DeleteServiceModel'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { DeleteServiceUseCase } from '@/domain/usecases/service/DeleteServiceUseCase'

const fakeHttpRequest: HttpRequest<DeleteServiceModel> = {
  body: {
    id: 1
  }
}

interface SutType {
  sut: DeleteServiceController
  validatorStub: MockProxy<Validator>
  deleteServiceUseCaseStub: MockProxy<DeleteServiceUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const deleteServiceUseCaseStub = mock<DeleteServiceUseCase>()

  const sut = new DeleteServiceController(
    validatorStub,
    deleteServiceUseCaseStub
  )

  return {
    sut,
    validatorStub,
    deleteServiceUseCaseStub
  }
}

describe('DeleteServiceController', () => {
  describe('Validator', () => {
    test('should call validator with correct value', async () => {
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
  describe('DeleteServiceUseCase', () => {
    test('should call DeleteServiceUseCase with correct values', async () => {
      const { sut, deleteServiceUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(deleteServiceUseCaseStub.delete).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(deleteServiceUseCaseStub.delete).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if AddServiceUseCase throws', async () => {
      const { sut, deleteServiceUseCaseStub } = makeSut()
      deleteServiceUseCaseStub.delete.mockImplementationOnce(() => {
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
