import { DbLogoutUseCase } from './DbLogoutUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { UpdateAcessTokenRepository } from '@/data/protocols/db/user/UpdateAcessTokenRepository'

const fakeCurrentUserId = 'dsadas-7875dsa-45dasdas2-ads'

interface SutType {
  sut: DbLogoutUseCase
  updateAcessTokenRepositoryStub: MockProxy<UpdateAcessTokenRepository>
}

const makeSut = (): SutType => {
  const updateAcessTokenRepositoryStub = mock<UpdateAcessTokenRepository>()

  const sut = new DbLogoutUseCase(updateAcessTokenRepositoryStub)

  return {
    sut,
    updateAcessTokenRepositoryStub
  }
}

describe('DbLogoutUseCase', () => {
  test('should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()

    await sut.logOut(fakeCurrentUserId)

    expect(updateAcessTokenRepositoryStub.updateAccessToken).toHaveBeenCalledWith(
      fakeCurrentUserId,
      ''
    )
    expect(updateAcessTokenRepositoryStub.updateAccessToken).toHaveBeenCalledTimes(1)
  })
  test('should throw if UpdateAcessTokenRepository throws', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    updateAcessTokenRepositoryStub.updateAccessToken.mockImplementationOnce(() => {
      throw new Error()
    })

    const user = sut.logOut(fakeCurrentUserId)

    await expect(user).rejects.toThrow()
  })
})
