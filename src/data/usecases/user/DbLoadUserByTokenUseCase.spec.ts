import { DbLoadUserByTokenUseCase } from './DbLoadUserByTokenUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { Decrypter } from '@/data/protocols/cryptography/Decrypter'
import { LoadUserByTokenRepository } from '@/data/protocols/db/user/LoadUserByTokenRepository'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'

const fakeAccessToken = 'any_token'
const fakeDecryptedToken = 'any_value'

const fakeUser: UserModel = {
  id: 'any_id',
  name: 'any_username',
  username: 'any_username',
  password: 'hashed_password',
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE
}

interface SutType {
  sut: DbLoadUserByTokenUseCase
  decrypterStub: MockProxy<Decrypter>
  loadUserByTokenRepositoryStub: MockProxy<LoadUserByTokenRepository>
}

const makeSut = (): SutType => {
  const decrypterStub = mock<Decrypter>()
  decrypterStub.decrypt.mockReturnValue(Promise.resolve(fakeDecryptedToken))

  const loadUserByTokenRepositoryStub = mock<LoadUserByTokenRepository>()
  loadUserByTokenRepositoryStub.loadByToken.mockReturnValue(
    Promise.resolve(fakeUser)
  )

  const sut = new DbLoadUserByTokenUseCase(
    decrypterStub,
    loadUserByTokenRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    loadUserByTokenRepositoryStub
  }
}

describe('DbLoadUserByTokenUseCase', () => {
  describe('Decrypter', () => {
    test('should call Decrypter with correct value', async () => {
      const { sut, decrypterStub } = makeSut()

      await sut.load(fakeAccessToken, [UserRole.EMPLOYEE])
      expect(decrypterStub.decrypt).toHaveBeenCalledWith(fakeAccessToken)
      expect(decrypterStub.decrypt).toHaveBeenCalledTimes(1)
    })
    test('should return null if Decrypter returns null', async () => {
      const { sut, decrypterStub } = makeSut()
      decrypterStub.decrypt.mockReturnValueOnce(Promise.resolve(null))

      const res = await sut.load(fakeAccessToken, [UserRole.EMPLOYEE])
      expect(res).toBeNull()
    })
    test('should return null if Decrypter throws', async () => {
      const { sut, decrypterStub } = makeSut()
      decrypterStub.decrypt.mockImplementationOnce(() => {
        throw new Error()
      })

      const res = await sut.load(fakeAccessToken, [UserRole.EMPLOYEE])
      expect(res).toBeNull()
    })
  })
  describe('LoadUserByTokenRepository', () => {
    test('should call LoadUserByTokenRepository with correct value', async () => {
      const { sut, loadUserByTokenRepositoryStub } = makeSut()

      await sut.load(fakeAccessToken)
      expect(loadUserByTokenRepositoryStub.loadByToken).toHaveBeenCalledWith(
        fakeAccessToken
      )
      expect(loadUserByTokenRepositoryStub.loadByToken).toHaveBeenCalledTimes(1)
    })
    test('should return null if LoadUserByTokenRepository returns null', async () => {
      const { sut, loadUserByTokenRepositoryStub } = makeSut()
      loadUserByTokenRepositoryStub.loadByToken.mockReturnValueOnce(
        Promise.resolve(null)
      )

      const res = await sut.load(fakeAccessToken)
      expect(res).toBeNull()
    })
    test('should throw if LoadUserByTokenRepository throws', async () => {
      const { sut, loadUserByTokenRepositoryStub } = makeSut()
      loadUserByTokenRepositoryStub.loadByToken.mockImplementationOnce(() => {
        throw new Error()
      })

      const res = sut.load(fakeAccessToken)
      await expect(res).rejects.toThrow()
    })
    test('should return null if LoadUserByTokenRepository return an user and the user role is not in allowed roles', async () => {
      const { sut } = makeSut()

      const res = await sut.load(fakeAccessToken, [UserRole.ADMIN])
      expect(res).toBeNull()
    })
    test('should return an UserModel if LoadUserByTokenRepository returns an user and allowed roles is not passed', async () => {
      const { sut } = makeSut()

      const res = await sut.load(fakeAccessToken)
      expect(res).toEqual(fakeUser)
    })
    test('should return an UserModel if LoadUserByTokenRepository returns an user and the user role is in the allowed roles', async () => {
      const { sut } = makeSut()

      const res = await sut.load(fakeAccessToken, [
        UserRole.ADMIN,
        UserRole.EMPLOYEE
      ])
      expect(res).toEqual(fakeUser)
    })
  })
})
