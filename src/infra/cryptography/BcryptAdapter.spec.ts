import { BcryptAdapter } from './BcryptAdapter'
import bcrypt from 'bcrypt'

const fakeValue = 'any_value'
const fakeHashedValue = 'any_hash'

const salt = 12
jest.mock('bcrypt', () => ({
  compare: (): Promise<boolean> => Promise.resolve(true),
  hashSync: (): string => fakeHashedValue
}))

interface SutType {
  sut: BcryptAdapter
}

const makeSut = (): SutType => {
  const sut = new BcryptAdapter(salt)

  return {
    sut
  }
}

describe('BcryptAdapter', () => {
  describe('compare()', () => {
    test('should call bcrypt with correct values', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await sut.compare(fakeValue, fakeHashedValue)

      expect(compareSpy).toHaveBeenCalledWith(fakeValue, fakeHashedValue)
      expect(compareSpy).toHaveBeenCalledTimes(1)
    })
    test('should return false if bcrypt returns false', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      compareSpy.mockReturnValueOnce(Promise.resolve(false))

      const isValid = await sut.compare(fakeValue, fakeHashedValue)

      expect(isValid).toBe(false)
    })
    test('should return true if bcrypt returns true', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      compareSpy.mockReturnValueOnce(Promise.resolve(true))

      const isValid = await sut.compare(fakeValue, fakeHashedValue)

      expect(isValid).toBe(true)
    })
    test('should throw if bcrypt throws', async () => {
      const { sut } = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      compareSpy.mockImplementationOnce(() => {
        throw new Error()
      })

      const res = sut.compare(fakeValue, fakeHashedValue)

      await expect(res).rejects.toThrow()
    })
  })
  describe('encrypt()', () => {
    test('should call bcrypt with correct values', () => {
      const { sut } = makeSut()
      const encryptSpy = jest.spyOn(bcrypt, 'hashSync')

      sut.encrypt(fakeValue)

      expect(encryptSpy).toHaveBeenCalledWith(fakeValue, salt)
      expect(encryptSpy).toHaveBeenCalledTimes(1)
    })
    test('should return an hashed value on success', () => {
      const { sut } = makeSut()

      const hashedValue = sut.encrypt(fakeValue)

      expect(hashedValue).toBe(fakeHashedValue)
    })
    test('should throw if bcrypt throws', () => {
      const { sut } = makeSut()

      const encryptSpy = jest.spyOn(bcrypt, 'hashSync')
      encryptSpy.mockImplementationOnce(() => {
        throw new Error()
      })

      expect(sut.encrypt).toThrow()
    })
  })
})
