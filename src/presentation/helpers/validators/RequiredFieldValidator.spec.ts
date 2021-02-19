import { RequiredFieldValidator } from './RequiredFieldValidator'
import { MissingParamError } from '@/presentation/protocols/errors/MissingParamError'

interface SutType {
  sut: RequiredFieldValidator
}

const makeSut = (): SutType => {
  const sut = new RequiredFieldValidator('field2')

  return {
    sut
  }
}

describe('RequiredFieldValidator', () => {
  test('should return an Error if fails', () => {
    const { sut } = makeSut()

    const input = {
      field1: 'any_value',
      field3: 'any_value'
    }

    const error = sut.validate(input)
    expect(error).toEqual(new MissingParamError('field2'))
  })

  test('should return null if succeed', () => {
    const { sut } = makeSut()

    const input = {
      field1: 'any_value',
      field2: 'any_value',
      field3: 'any_value'
    }

    const error = sut.validate(input)
    expect(error).toBeNull()
  })
})
