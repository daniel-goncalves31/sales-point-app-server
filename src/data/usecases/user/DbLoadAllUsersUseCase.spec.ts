import { DbLoadAllUsersUseCase } from './DbLoadAllUsersUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoadAllUsersRepository } from '@/data/protocols/db/user/LoadAllUsersRepository'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'

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
  sut: DbLoadAllUsersUseCase
  loadAllUsersRepositoryStub: MockProxy<LoadAllUsersRepository>
}

const makeSut = (): SutType => {
  const loadAllUsersRepositoryStub = mock<LoadAllUsersRepository>()
  loadAllUsersRepositoryStub.getAllUsers.mockReturnValue(
    Promise.resolve(fakeUsersArr)
  )

  const sut = new DbLoadAllUsersUseCase(loadAllUsersRepositoryStub)

  return {
    sut,
    loadAllUsersRepositoryStub
  }
}

describe('DbLoadAllUsersUseCase', () => {
  test('should call LoadAllUsersRepository', async () => {
    const { sut, loadAllUsersRepositoryStub } = makeSut()

    await sut.load()

    expect(loadAllUsersRepositoryStub.getAllUsers).toBeCalledTimes(1)
  })
  test('should throw if LoadAllUsersRepository throws', async () => {
    const { sut, loadAllUsersRepositoryStub } = makeSut()
    loadAllUsersRepositoryStub.getAllUsers.mockImplementationOnce(() => {
      throw new Error()
    })

    const res = sut.load()

    await expect(res).rejects.toThrow()
  })
  test('should return an UserModel array on success', async () => {
    const { sut } = makeSut()

    const allusers = await sut.load()

    expect(allusers).toEqual(fakeUsersArr)
  })
})
