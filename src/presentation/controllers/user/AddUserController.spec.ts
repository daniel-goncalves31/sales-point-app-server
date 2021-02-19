import { AddUserController } from './AddUserController'
import { MockProxy, mock } from 'jest-mock-extended'
import { NewUserModel } from '@/domain/models/user/NewUserModel'
import { AddUserUseCase } from '@/domain/usecases/user/AddUserUseCase'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  ok
} from '@/presentation/helpers/http-responses'

const fakeUser: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'any_username',
  password: 'sdaedasdsa',
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE,
}

const fakeHttpRequest: HttpRequest<NewUserModel> = {
  body: {
    name: 'any_name',
    username: 'any_username',
    password: 'sdaedasdsa',
    role: UserRole.EMPLOYEE,
    status: UserStatus.ACTIVE,
  }
}

interface SutType {
  sut: AddUserController
  validatorStub: MockProxy<Validator>
  addUserUseCaseStub: MockProxy<AddUserUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator>()
  validatorStub.validate.mockReturnValue(null)

  const addUserUseCaseStub = mock<AddUserUseCase>()
  addUserUseCaseStub.add.mockReturnValue(Promise.resolve(fakeUser))

  const sut = new AddUserController(validatorStub, addUserUseCaseStub)

  return {
    sut,
    validatorStub,
    addUserUseCaseStub
  }
}

describe('AddUserController', () => {
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

  describe('AddUserUseCase', () => {
    test('should call AddUserUseCase with correct values', async () => {
      const { sut, addUserUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(addUserUseCaseStub.add).toHaveBeenCalledWith(
        fakeHttpRequest.body
      )
      expect(addUserUseCaseStub.add).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if AddUserUseCase throws', async () => {
      const { sut, addUserUseCaseStub } = makeSut()
      addUserUseCaseStub.add.mockImplementationOnce(() => {
        throw new Error()
      })
      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(ok(fakeUser))
  })
})
