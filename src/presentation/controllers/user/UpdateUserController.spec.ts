import { UpdateUserController } from './UpdateUserController'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import {
  badRequest,
  serverError,
  noContent
} from '@/presentation/helpers/http-responses'
import { UpdateUserUseCase } from '@/domain/usecases/user/UpdateUserUseCase'

const fakeHttpRequest: HttpRequest<UserModel> = {
  body: {
    id: 'any_id',
    name: 'any_name',
    username: 'any_username',
    password: 'sdaedasdsa',
    role: UserRole.EMPLOYEE,
    status: UserStatus.ACTIVE,
  }
}

interface SutType {
  sut: UpdateUserController
  validatorStub: MockProxy<Validator>
  updateUserUseCaseStub: MockProxy<UpdateUserUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const updateUserUseCaseStub = mock<UpdateUserUseCase>()

  const sut = new UpdateUserController(
    validatorStub,
    updateUserUseCaseStub
  )

  return {
    sut,
    validatorStub,
    updateUserUseCaseStub
  }
}

describe('UpdateUserController', () => {
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

  describe('UpdateUserUseCase', () => {
    test('should call UpdateUserUseCase with correct values', async () => {
      const { sut, updateUserUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(updateUserUseCaseStub.update).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(updateUserUseCaseStub.update).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if UpdateUserUseCase throws', async () => {
      const { sut, updateUserUseCaseStub } = makeSut()
      updateUserUseCaseStub.update.mockImplementationOnce(() => {
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
