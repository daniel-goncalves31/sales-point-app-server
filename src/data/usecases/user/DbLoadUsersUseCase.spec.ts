import { DbLoadUsersUseCase } from './DbLoadUsersUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoadUsersRepository } from '@/data/protocols/db/user/LoadUsersRepository'
import { UserList } from '@/domain/models/user/UserList'

interface SutType {
  sut: DbLoadUsersUseCase
  loadUsersRepositoryStub: MockProxy<LoadUsersRepository>
}

const fakeUserList: UserList[] = [
  {
    id: 'any_id',
    name: 'any_name'
  }
]

const makeSut = (): SutType => {
  const loadUsersRepositoryStub = mock<LoadUsersRepository>()
  loadUsersRepositoryStub.load.mockReturnValue(Promise.resolve(fakeUserList))

  const sut = new DbLoadUsersUseCase(loadUsersRepositoryStub)

  return {
    sut,
    loadUsersRepositoryStub
  }
}

describe('DbLoadUsersUseCase', () => {
  test('should call LoadUsersRepository', async () => {
    const { sut, loadUsersRepositoryStub } = makeSut()
    await sut.load()
    expect(loadUsersRepositoryStub.load).toHaveBeenCalledTimes(1)
  })
  test('should throw if LoadUsersRepository throws', async () => {
    const { sut, loadUsersRepositoryStub } = makeSut()
    loadUsersRepositoryStub.load.mockImplementationOnce(() => {
      throw new Error()
    })

    const res = sut.load()
    await expect(res).rejects.toThrow()
  })
  test('should return an UserList array on success', async () => {
    const { sut } = makeSut()

    const users = await sut.load()
    expect(users).toEqual(fakeUserList)
  })
})
