import { LoginController } from './LoginController'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoginUseCase } from '@/domain/usecases/user/LoginUseCase'
import { LoginCredentialsModel } from '@/domain/models/user/LoginCredentialsModel'
import { AuthenticationModel } from '@/domain/models/user/AuthenticationModel'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { Validator } from '@/presentation/protocols/Validator'
import {
  badRequest,
  serverError,
  ok,
  noContent
} from '@/presentation/helpers/http-responses'
import { UserRole, UserStatus } from '@/domain/models/user/UserModel'

const fakeHttpRequest: HttpRequest<LoginCredentialsModel> = {
  body: {
    username: 'any_username',
    password: 'any_password'
  }
}

const fakeUser: AuthenticationModel = {
  user: {
    id: 'any_id',
    name: 'any_name',
    username: 'any_username',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE
  },
  accessToken: 'any_value'
}

interface SutType {
  sut: LoginController
  validatorStub: MockProxy<Validator<LoginCredentialsModel>>
  loginUseCaseStub: MockProxy<LoginUseCase>
}

const makeSut = (): SutType => {
  const validatorStub = mock<Validator<LoginCredentialsModel>>()
  validatorStub.validate.mockReturnValue(null)

  const loginUseCaseStub = mock<LoginUseCase>()
  loginUseCaseStub.login.mockReturnValue(Promise.resolve(fakeUser))

  const sut = new LoginController(validatorStub, loginUseCaseStub)

  return {
    sut,
    validatorStub,
    loginUseCaseStub
  }
}

describe('LoginController', () => {
  describe('Validator', () => {
    test('should call validator with correct values', async () => {
      const { sut, validatorStub } = makeSut()

      sut.handle(fakeHttpRequest)

      expect(validatorStub.validate).toHaveBeenCalledWith(fakeHttpRequest.body)
      expect(validatorStub.validate).toHaveBeenCalledTimes(1)
    })
    test('should return 400 if validator fails', async () => {
      const { sut, validatorStub } = makeSut()
      validatorStub.validate.mockReturnValueOnce(new Error())

      const res = await sut.handle(fakeHttpRequest)
      expect(res).toEqual(badRequest(new Error()))
    })
    test('should return 500 if validator throws', async () => {
      const { sut, validatorStub } = makeSut()
      validatorStub.validate.mockImplementationOnce(() => {
        throw new Error()
      })

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
  })

  describe('LoginUseCase', () => {
    test('should call LoginUseCase with correct values', async () => {
      const { sut, loginUseCaseStub } = makeSut()

      await sut.handle(fakeHttpRequest)

      expect(loginUseCaseStub.login).toHaveBeenCalledWith(fakeHttpRequest.body)
      expect(loginUseCaseStub.login).toHaveBeenCalledTimes(1)
    })
    test('should return 500 if LoginUseCase throws', async () => {
      const { sut, loginUseCaseStub } = makeSut()
      loginUseCaseStub.login.mockImplementationOnce(() => {
        throw new Error()
      })

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(serverError())
    })
    test('should return 204 if LoginUseCase returns null', async () => {
      const { sut, loginUseCaseStub } = makeSut()
      loginUseCaseStub.login.mockReturnValueOnce(Promise.resolve(null))

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(noContent())
    })
    test('should return 200 if LoginUseCase returns an UserModel', async () => {
      const { sut } = makeSut()

      const res = await sut.handle(fakeHttpRequest)

      expect(res).toEqual(ok(fakeUser))
    })
  })
})
