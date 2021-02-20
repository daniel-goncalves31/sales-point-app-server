import { AuthMiddleware } from './AuthMiddleware'
import { forbidden, serverError, ok } from '../helpers/http-responses'
import { AccessDeniedError } from '../protocols/errors'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoadUserByTokenUseCase } from '@/domain/usecases/user/LoadUserByToken'
import { HttpRequest } from '../protocols/HttpRequest'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'

const fakeUserModel: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'any_username',
  password: 'hash_password',
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE
}

interface SutType {
  sut: AuthMiddleware
  loadUserByTokenUseCaseStub: MockProxy<LoadUserByTokenUseCase>
}

const makeSut = (): SutType => {
  const loadUserByTokenUseCaseStub = mock<LoadUserByTokenUseCase>()
  loadUserByTokenUseCaseStub.load.mockReturnValue(
    Promise.resolve(fakeUserModel)
  )

  const sut = new AuthMiddleware(loadUserByTokenUseCaseStub, [UserRole.ADMIN])

  return {
    sut,
    loadUserByTokenUseCaseStub
  }
}

describe('AuthMiddleware', () => {
  test('should return 403 if d794$7dsa99_dsadsa978lbipe$sdspp header do not exists', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({ headers: {} })
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should call LoadUserByTokenUseCase with correct value', async () => {
    const { sut, loadUserByTokenUseCaseStub } = makeSut()

    const httpRequest: HttpRequest = {
      headers: {
        d794$7dsa99_dsadsa978lbipe$sdspp: 'any_token'
      }
    }

    await sut.handle(httpRequest)
    expect(loadUserByTokenUseCaseStub.load).toHaveBeenCalledWith(
      httpRequest.headers['d794$7dsa99_dsadsa978lbipe$sdspp'],
      [UserRole.ADMIN]
    )
    expect(loadUserByTokenUseCaseStub.load).toHaveBeenCalledTimes(1)
  })
  test('should return 403 if LoadUserByTokenUseCase returns null', async () => {
    const { sut, loadUserByTokenUseCaseStub } = makeSut()
    loadUserByTokenUseCaseStub.load.mockReturnValueOnce(Promise.resolve(null))
    const httpRequest: HttpRequest = {
      headers: {
        d794$7dsa99_dsadsa978lbipe$sdspp: 'any_token'
      }
    }

    const res = await sut.handle(httpRequest)
    expect(res).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should return 500 if LoadUserByTokenUseCase throws', async () => {
    const { sut, loadUserByTokenUseCaseStub } = makeSut()
    loadUserByTokenUseCaseStub.load.mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest: HttpRequest = {
      headers: {
        d794$7dsa99_dsadsa978lbipe$sdspp: 'any_token'
      }
    }

    const res = await sut.handle(httpRequest)
    expect(res).toEqual(serverError())
  })
  test('should return 200 if LoadUserByTokenUseCase return an user', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      headers: {
        d794$7dsa99_dsadsa978lbipe$sdspp: 'any_token'
      }
    }

    const res = await sut.handle(httpRequest)
    const accessToken = fakeUserModel.accessToken
    delete fakeUserModel.password
    delete fakeUserModel.accessToken
    expect(res).toEqual(ok({ user: fakeUserModel, accessToken: accessToken }))
    expect((res.body as any).user.accessToken).toBeFalsy()
    expect((res.body as any).user.password).toBeFalsy()
  })
})
