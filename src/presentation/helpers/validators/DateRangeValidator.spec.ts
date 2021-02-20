import { DateRangeValidator } from './DateRangeValidator'
import { InvalidParamError } from '@/presentation/protocols/errors'

interface SutType {
  sut: DateRangeValidator
}

const makeSut = (): SutType => {
  const sut = new DateRangeValidator('field')

  return {
    sut
  }
}

describe('DateRangeValidator', () => {
  describe('should return an InvalidParamError if...', () => {
    const { sut } = makeSut()

    test(' - the input do not includes " - "', () => {
      const error = sut.validate({ field: '2020-01-01_2020-12-31' })
      expect(error).toEqual(new InvalidParamError('field'))
    })

    test(' - the start value is not a date', () => {
      const error = sut.validate({ field: 'foo - 2020-12-31' })
      expect(error).toEqual(new InvalidParamError('field'))
    })

    test(' - the end value is not a date', () => {
      const error = sut.validate({ field: '2020-01-01 - bar' })
      expect(error).toEqual(new InvalidParamError('field'))
    })

    test(' - the end date is previous that the start date', () => {
      const error = sut.validate({ field: '2020-01-01 - 2019-12-31' })
      expect(error).toEqual(new InvalidParamError('field'))
    })
  })

  test('should return null if the input is valid', () => {
    const { sut } = makeSut()

    let error = sut.validate({ field: '' })
    expect(error).toBeNull()

    error = sut.validate({ field: '2020-01-01 - 2020-12-31' })
    expect(error).toBeNull()
  })
})
