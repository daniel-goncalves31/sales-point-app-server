import { DbUpdateUserUseCase } from './DbUpdateUserUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { UpdateUserRepository } from '@/data/protocols/db/user/UpdateUserRepository'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { Encrypter } from '@/data/protocols/cryptography/Encrypter'

const fakeUser: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'any_username',
  password: 'any_password',
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE
}

interface SutType {
  sut: DbUpdateUserUseCase
  updateUserRepositoryStub: MockProxy<UpdateUserRepository>
  encrypterStub: MockProxy<Encrypter>
}

const makeSut = (): SutType => {
  const encrypterStub = mock<Encrypter>()
  encrypterStub.encrypt.mockReturnValue('hashed_value')

  const updateUserRepositoryStub = mock<UpdateUserRepository>()

  const sut = new DbUpdateUserUseCase(updateUserRepositoryStub, encrypterStub)

  return {
    sut,
    updateUserRepositoryStub,
    encrypterStub
  }
}

describe('DbUpdateUserUseCase', () => {
  describe('Encrypter', () => {
    test('should call Encrypter with correct values', async () => {
      const { sut, encrypterStub } = makeSut()

      await sut.update(fakeUser)
      expect(encrypterStub.encrypt).toHaveBeenCalledWith('any_password')
      expect(encrypterStub.encrypt).toHaveBeenCalledTimes(1)
    })
    test('should throw if Encrypter throws', async () => {
      const { sut, encrypterStub } = makeSut()
      encrypterStub.encrypt.mockImplementationOnce(() => {
        throw new Error()
      })

      const user = sut.update(fakeUser)

      await expect(user).rejects.toThrow()
    })
  })
  test('should call UpdateUserRepository with correct value', async () => {
    const { sut, updateUserRepositoryStub } = makeSut()

    await sut.update(fakeUser)

    expect(updateUserRepositoryStub.update).toHaveBeenCalledWith({ ...fakeUser, password: 'hashed_value' })
    expect(updateUserRepositoryStub.update).toHaveBeenCalledTimes(1)
  })
  test('should throw if UpdateUserRepository throws', async () => {
    const { sut, updateUserRepositoryStub } = makeSut()
    updateUserRepositoryStub.update.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.update(fakeUser)

    await expect(promise).rejects.toThrow()
  })
})
