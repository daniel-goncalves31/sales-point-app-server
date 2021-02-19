import { JsonwebtokenAdapter } from './JsonwebtokenAdapter'
import jwt from 'jsonwebtoken'

const fakeValue = 'any_value'
const fakeAccessToken = 'encrypted_value'

const fakeSecret = 'secret'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => fakeAccessToken,
  verify: (): Promise<string> => Promise.resolve(fakeValue)
}))

interface SutType {
  sut: JsonwebtokenAdapter
}

const makeSut = (): SutType => {
  const sut = new JsonwebtokenAdapter(fakeSecret)

  return {
    sut
  }
}

describe('JsonwebtokenAdapter', () => {
  describe('encrypt()', () => {
    test('should call jwt with correct values', () => {
      const { sut } = makeSut()
      const encryptSpy = jest.spyOn(jwt, 'sign')

      sut.encrypt(fakeValue)

      expect(encryptSpy).toHaveBeenCalledWith({ id: fakeValue }, fakeSecret)
      expect(encryptSpy).toHaveBeenCalledTimes(1)
    })
    test('should return an access token on success', () => {
      const { sut } = makeSut()

      const accessToken = sut.encrypt(fakeValue)

      expect(accessToken).toBe(fakeAccessToken)
    })
    test('should throw if bcrypt throws', () => {
      const { sut } = makeSut()

      const encryptSpy = jest.spyOn(jwt, 'sign')
      encryptSpy.mockImplementationOnce(() => {
        throw new Error()
      })

      expect(sut.encrypt).toThrow()
    })
  })

  describe('decrypt()', () => {
    test('should call jwt with correct values', async () => {
      const { sut } = makeSut()
      const decryptSpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt(fakeAccessToken)

      expect(decryptSpy).toHaveBeenCalledWith(fakeAccessToken, fakeSecret)
      expect(decryptSpy).toHaveBeenCalledTimes(1)
    })
    test('should throw if jwt throws', async () => {
      const { sut } = makeSut()
      const decryptSpy = jest.spyOn(jwt, 'verify')

      decryptSpy.mockImplementationOnce(() => {
        throw new Error()
      })

      const res = sut.decrypt(fakeAccessToken)

      await expect(res).rejects.toThrow()
    })
    test('should return a value on success', async () => {
      const { sut } = makeSut()

      const res = await sut.decrypt(fakeAccessToken)

      expect(res).toEqual(fakeValue)
    })
  })
})
