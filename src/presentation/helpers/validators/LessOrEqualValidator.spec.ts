import { LessOrEqualValidator } from './LessOrEqualValidator'
import { InvalidParamError } from '@/presentation/protocols/errors'

interface SutType {
  sut: LessOrEqualValidator
}

const makeSut = (): SutType => {
  const sut = new LessOrEqualValidator('value1', 'value2')

  return {
    sut
  }
}

describe('LessOrEqualValidator', () => {
  test('should return an InvalidParamError if fails', async () => {
    const { sut } = makeSut()

    const fakeInput = {
      value1: 1,
      value2: 2
    }

    const error = sut.validate(fakeInput)
    expect(error).toEqual(new InvalidParamError('value2'))
  })
  test('should return null if succeed', async () => {
    const { sut } = makeSut()

    const fakeInput = {
      value1: 1,
      value2: 1
    }

    let error = sut.validate(fakeInput)
    expect(error).toBeNull()

    fakeInput.value2 = 0

    error = sut.validate(fakeInput)
    expect(error).toBeNull()
  })
})
