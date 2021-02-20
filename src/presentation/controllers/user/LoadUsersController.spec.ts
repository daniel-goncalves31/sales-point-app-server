import { LoadUsersController } from './LoadUsersController'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoadUsersUseCase } from '@/domain/usecases/user/LoadUsersUseCase'
import { serverError, ok } from '@/presentation/helpers/http-responses'
import { UserList } from '@/domain/models/user/UserList'

const fakeHttpRequest: HttpRequest = {
  body: {}
}

const fakeUserList: UserList[] = [
  {
    id: 'any_id',
    name: 'any_name'
  }
]

interface SutType {
  sut: LoadUsersController
  loadUsersUseCaseStub: MockProxy<LoadUsersUseCase>
}

const makeSut = (): SutType => {
  const loadUsersUseCaseStub = mock<LoadUsersUseCase>()
  loadUsersUseCaseStub.load.mockReturnValue(Promise.resolve(fakeUserList))

  const sut = new LoadUsersController(loadUsersUseCaseStub)

  return {
    sut,
    loadUsersUseCaseStub
  }
}

describe('LoadUsersController', () => {
  test('should call LoadUsersUseCase with correct values', async () => {
    const { sut, loadUsersUseCaseStub } = makeSut()
    await sut.handle(fakeHttpRequest)
    expect(loadUsersUseCaseStub.load).toHaveBeenCalledTimes(1)
  })
  test('should return 500 if LoadUsersUseCase throws', async () => {
    const { sut, loadUsersUseCaseStub } = makeSut()
    loadUsersUseCaseStub.load.mockImplementationOnce(() => {
      throw new Error()
    })

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(serverError())
  })
  test('should return 200 if LoadUsersUseCase succeeds', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(ok(fakeUserList))
  })
})
