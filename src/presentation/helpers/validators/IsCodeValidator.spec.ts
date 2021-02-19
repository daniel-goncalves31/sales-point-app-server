import { InvalidCodeError } from '@/presentation/protocols/errors/InvalidCodeError'
import { IsCodeValidator } from './IsCodeValidator'

interface SutType {
  sut: IsCodeValidator
}

const makeSut = (): SutType => {
  const sut = new IsCodeValidator(15)

  return {
    sut
  }
}

describe('IsCodeValidator', () => {
  it('should return InvalidCodeError if the code is invalid', async () => {
    const { sut } = makeSut()

    const invalidCode = '1--456//9101123'

    const error = sut.validate(invalidCode as string)
    expect(error).toEqual(new InvalidCodeError(invalidCode))
  })
  it('should return null if the code is valid', async () => {
    const { sut } = makeSut()

    const validCode = '123456789101123'

    const error = sut.validate(validCode)
    expect(error).toBeNull()
  })
})
