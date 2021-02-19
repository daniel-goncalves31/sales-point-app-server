import { DbAddUserUseCase } from './DbAddUserUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { NewUserModel } from '@/domain/models/user/NewUserModel'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { InsertUserRepository } from '@/data/protocols/db/user/InsertUserRepository'
import { Encrypter } from '@/data/protocols/cryptography/Encrypter'
import { UUIDGenerator } from '@/data/protocols/generators/UUIDGenerator'


const fakeNewUser: NewUserModel = {
  name: 'any_name',
  username: 'any_username',
  password: 'sdaedasdsa',
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE,
}

const fakeUser: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'any_username',
  password: 'sdaedasdsa',
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE,
}

const fakeUUID = 'any_uuid'

interface SutType {
  sut: DbAddUserUseCase
  insertUserRepositoryStub: MockProxy<InsertUserRepository>
  encrypterStub: MockProxy<Encrypter>
  uuidGeneratorStub: MockProxy<UUIDGenerator>
}

const makeSut = (): SutType => {

  const encrypterStub = mock<Encrypter>()
  encrypterStub.encrypt.mockReturnValue('hashed_value')

  const uuidGeneratorStub = mock<UUIDGenerator>()
  uuidGeneratorStub.generate.mockReturnValue(fakeUUID)

  const insertUserRepositoryStub = mock<InsertUserRepository>()
  insertUserRepositoryStub.insert.mockReturnValue(
    Promise.resolve(fakeUser)
  )

  const sut = new DbAddUserUseCase(insertUserRepositoryStub, encrypterStub, uuidGeneratorStub)

  return {
    sut,
    insertUserRepositoryStub,
    encrypterStub,
    uuidGeneratorStub
  }
}

describe('DbAddUserUseCase', () => {
  describe('Encrypter', () => {
    test('should call Encrypter with correct values', async () => {
      const { sut, encrypterStub } = makeSut()

      await sut.add(fakeNewUser)
      expect(encrypterStub.encrypt).toHaveBeenCalledWith(fakeUser.password)
      expect(encrypterStub.encrypt).toHaveBeenCalledTimes(1)
    })
    test('should throw if Encrypter throws', async () => {
      const { sut, encrypterStub } = makeSut()
      encrypterStub.encrypt.mockImplementationOnce(() => {
        throw new Error()
      })

      const user = sut.add(fakeNewUser)

      await expect(user).rejects.toThrow()
    })
  })
  describe('UUIDGenerator', () => {
    test('should call UUIDGenerator with correct values', async () => {
      const { sut, uuidGeneratorStub } = makeSut()

      await sut.add(fakeNewUser)
      expect(uuidGeneratorStub.generate).toHaveBeenCalledTimes(1)
    })
    test('should throw if UUIDGenerator throws', async () => {
      const { sut, uuidGeneratorStub } = makeSut()
      uuidGeneratorStub.generate.mockImplementationOnce(() => {
        throw new Error()
      })

      const user = sut.add(fakeNewUser)

      await expect(user).rejects.toThrow()
    })
  })
  describe('InsertUserRepository', () => {

    test('should call InsertUserRepository with correct values', async () => {
      const { sut, insertUserRepositoryStub } = makeSut()

      await sut.add(fakeNewUser)

      expect(insertUserRepositoryStub.insert).toHaveBeenCalledWith(
        { ...fakeNewUser, password: 'hashed_value', id: fakeUUID }
      )
      expect(insertUserRepositoryStub.insert).toHaveBeenCalledTimes(1)
    })
    test('should throw if InsertUserRepository throws', async () => {
      const { sut, insertUserRepositoryStub } = makeSut()
      insertUserRepositoryStub.insert.mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.add(fakeNewUser)

      await expect(promise).rejects.toThrow()
    })
    test('should return an UserModel on success', async () => {
      const { sut } = makeSut()

      const user = await sut.add(fakeNewUser)

      expect(user).toEqual(fakeUser)
    })
  })
})
