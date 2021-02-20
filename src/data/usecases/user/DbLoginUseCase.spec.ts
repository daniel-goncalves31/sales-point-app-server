import { DbLoginUseCase } from './DbLoginUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoginCredentialsModel } from '@/domain/models/user/LoginCredentialsModel'
import { AuthenticationModel } from '@/domain/models/user/AuthenticationModel'
import { LoadUserByUsernameRepository } from '@/data/protocols/db/user/LoadUserByUsernameRepository'
import { HashComparer } from '@/data/protocols/cryptography/HashComparer'
import { Encrypter } from '@/data/protocols/cryptography/Encrypter'
import { UpdateAcessTokenRepository } from '@/data/protocols/db/user/UpdateAcessTokenRepository'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'

const fakeLoginCredentials: LoginCredentialsModel = {
  username: 'any_username',
  password: 'any_password'
}

const fakeUser: UserModel = {
  id: 'any_id',
  name: 'any_username',
  username: 'any_username',
  password: 'hashed_password',
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE
}

const fakeAcessToken = 'dasd745sda7sdas-das4das7dsa8dsa-dsad4sa2d4as4das8d'

const fakeUserAuthenticated: AuthenticationModel = {
  user: fakeUser,
  accessToken: fakeAcessToken
}

interface SutType {
  sut: DbLoginUseCase
  loadUserByUsernameRepositoryStub: MockProxy<LoadUserByUsernameRepository>
  hashComparerStub: MockProxy<HashComparer>
  encrypterStub: MockProxy<Encrypter>
  updateAcessTokenRepositoryStub: MockProxy<UpdateAcessTokenRepository>
}

const makeSut = (): SutType => {
  const loadUserByUsernameRepositoryStub = mock<LoadUserByUsernameRepository>()
  loadUserByUsernameRepositoryStub.getUserByUsername.mockReturnValue(
    Promise.resolve(fakeUser)
  )

  const hashComparerStub = mock<HashComparer>()
  hashComparerStub.compare.mockReturnValue(Promise.resolve(true))

  const encrypterStub = mock<Encrypter>()
  encrypterStub.encrypt.mockReturnValue(fakeAcessToken)

  const updateAcessTokenRepositoryStub = mock<UpdateAcessTokenRepository>()

  const sut = new DbLoginUseCase(
    loadUserByUsernameRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAcessTokenRepositoryStub
  )

  return {
    sut,
    loadUserByUsernameRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAcessTokenRepositoryStub
  }
}

describe('DbLoginUseCase', () => {
  describe('LoadUserByUsernameRepository', () => {
    test('should call LoadUserByUsernameRepository with correct values', async () => {
      const { sut, loadUserByUsernameRepositoryStub } = makeSut()

      await sut.login(fakeLoginCredentials)

      expect(
        loadUserByUsernameRepositoryStub.getUserByUsername
      ).toHaveBeenCalledWith(fakeLoginCredentials.username)
      expect(
        loadUserByUsernameRepositoryStub.getUserByUsername
      ).toHaveBeenCalledTimes(1)
    })

    test('should return null if LoadUserByUsernameRepository returns null', async () => {
      const { sut, loadUserByUsernameRepositoryStub } = makeSut()
      loadUserByUsernameRepositoryStub.getUserByUsername.mockReturnValueOnce(
        Promise.resolve(null)
      )

      const user = await sut.login(fakeLoginCredentials)

      expect(user).toBeNull()
    })

    test('should throw if LoadUserByUsernameRepository throws', async () => {
      const { sut, loadUserByUsernameRepositoryStub } = makeSut()
      loadUserByUsernameRepositoryStub.getUserByUsername.mockImplementationOnce(
        () => {
          throw new Error()
        }
      )

      const user = sut.login(fakeLoginCredentials)

      await expect(user).rejects.toThrow()
    })
  })

  describe('HashComparer', () => {
    test('should call HashComparer with correct values', async () => {
      const { sut, hashComparerStub } = makeSut()

      await sut.login(fakeLoginCredentials)

      expect(hashComparerStub.compare).toHaveBeenCalledWith(
        fakeLoginCredentials.password,
        fakeUser.password
      )
      expect(hashComparerStub.compare).toHaveBeenCalledTimes(1)
    })
    test('should return null if HashComparer return false', async () => {
      const { sut, hashComparerStub } = makeSut()
      hashComparerStub.compare.mockReturnValueOnce(Promise.resolve(false))

      const user = await sut.login(fakeLoginCredentials)

      expect(user).toBeNull()
    })
    test('should throw if HashComparer throws', async () => {
      const { sut, hashComparerStub } = makeSut()
      hashComparerStub.compare.mockImplementationOnce(() => {
        throw new Error()
      })

      const user = sut.login(fakeLoginCredentials)

      await expect(user).rejects.toThrow()
    })
  })

  describe('Encrypter', () => {
    test('should call Encrypter with correct values', async () => {
      const { sut, encrypterStub } = makeSut()

      await sut.login(fakeLoginCredentials)

      expect(encrypterStub.encrypt).toHaveBeenCalledWith(fakeUser.id)
      expect(encrypterStub.encrypt).toHaveBeenCalledTimes(1)
    })
    test('should throw if Encrypter throws', async () => {
      const { sut, encrypterStub } = makeSut()
      encrypterStub.encrypt.mockImplementationOnce(() => {
        throw new Error()
      })

      const user = sut.login(fakeLoginCredentials)

      await expect(user).rejects.toThrow()
    })
  })
  describe('UpdateAcessTokenRepository', () => {
    test('should call UpdateAcessTokenRepository with correct values', async () => {
      const { sut, updateAcessTokenRepositoryStub } = makeSut()

      await sut.login(fakeLoginCredentials)

      expect(updateAcessTokenRepositoryStub.updateAccessToken).toHaveBeenCalledWith(
        fakeUser.id,
        fakeAcessToken
      )
      expect(updateAcessTokenRepositoryStub.updateAccessToken).toHaveBeenCalledTimes(1)
    })
    test('should throw if UpdateAcessTokenRepository throws', async () => {
      const { sut, updateAcessTokenRepositoryStub } = makeSut()
      updateAcessTokenRepositoryStub.updateAccessToken.mockImplementationOnce(() => {
        throw new Error()
      })

      const user = sut.login(fakeLoginCredentials)

      await expect(user).rejects.toThrow()
    })
  })
  test('should return an UserAuthenticatedModel on success', async () => {
    const { sut } = makeSut()

    const res = await sut.login(fakeLoginCredentials)
    expect(res).toEqual(fakeUserAuthenticated)
    expect((res?.user as any).password).toBeFalsy()
    expect((res?.user as any).accessToken).toBeFalsy()
  })
})
