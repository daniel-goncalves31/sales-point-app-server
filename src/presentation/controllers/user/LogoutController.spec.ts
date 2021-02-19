import { LogoutController } from './LogoutController'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { MockProxy, mock } from 'jest-mock-extended'
import { LogoutUseCase } from '@/domain/usecases/user/LogoutUseCase'
import { serverError, noContent } from '@/presentation/helpers/http-responses'
const fakeHttpRequest: HttpRequest = {
  currentUser: { id: 'any_id' } as any
}

interface SutType {
  sut: LogoutController
  logoutUseCaseStub: MockProxy<LogoutUseCase>
}

const makeSut = (): SutType => {
  const logoutUseCaseStub = mock<LogoutUseCase>()

  const sut = new LogoutController(logoutUseCaseStub)

  return {
    sut,
    logoutUseCaseStub
  }
}

describe('LogoutController', () => {
  test('should call LogoutUseCase with correct value', async () => {
    const { sut, logoutUseCaseStub } = makeSut()

    await sut.handle(fakeHttpRequest)

    expect(logoutUseCaseStub.logOut).toHaveBeenCalledWith(
      fakeHttpRequest.currentUser?.id
    )
    expect(logoutUseCaseStub.logOut).toHaveBeenCalledTimes(1)
  })
  test('should return 500 if LogoutUseCase throws', async () => {
    const { sut, logoutUseCaseStub } = makeSut()
    logoutUseCaseStub.logOut.mockImplementationOnce(() => {
      throw new Error()
    })

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(serverError())
  })
  test('should return 200 if LogoutUseCase succeeds', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(noContent())
  })
})
