import { LoadAllUsersController } from './LoadAllUsersController'
import { MockProxy, mock } from 'jest-mock-extended'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { serverError, ok } from '@/presentation/helpers/http-responses'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { LoadAllUsersUseCase } from '@/domain/usecases/user/LoadAllUsersUseCase'

const fakeHttpRequest: HttpRequest = {
  body: null
}

const fakeUser: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'any_username',
  password: 'sdaedasdsa',
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE,
}

const fakeUsersArr: UserModel[] = [fakeUser, fakeUser, fakeUser]

interface SutType {
  sut: LoadAllUsersController
  loadAllUsersUseCaseStub: MockProxy<LoadAllUsersUseCase>
}

const makeSut = (): SutType => {
  const loadAllUsersUseCaseStub = mock<LoadAllUsersUseCase>()
  loadAllUsersUseCaseStub.load.mockReturnValue(Promise.resolve(fakeUsersArr))

  const sut = new LoadAllUsersController(loadAllUsersUseCaseStub)

  return {
    sut,
    loadAllUsersUseCaseStub
  }
}

describe('LoadAllUsersController', () => {
  test('should call LoadAllUsersUseCase with no values', async () => {
    const { sut, loadAllUsersUseCaseStub } = makeSut()

    await sut.handle(fakeHttpRequest)

    expect(loadAllUsersUseCaseStub.load).toHaveBeenCalledTimes(1)
  })
  test('should return 500 if LoadAllUsersUseCase throws', async () => {
    const { sut, loadAllUsersUseCaseStub } = makeSut()
    loadAllUsersUseCaseStub.load.mockImplementationOnce(() => {
      throw new Error()
    })
    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(serverError())
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle(fakeHttpRequest)

    expect(res).toEqual(ok(fakeUsersArr))
  })
})
