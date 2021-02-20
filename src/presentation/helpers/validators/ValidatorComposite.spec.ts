import { ValidatorComposite } from './ValidatorComposite'
import { MockProxy, mock } from 'jest-mock-extended'
import { Validator } from '@/presentation/protocols/Validator'

interface SutType {
  sut: ValidatorComposite
  validator1Stub: MockProxy<Validator>
  validator2Stub: MockProxy<Validator>
}

const makeSut = (): SutType => {
  const validator1Stub = mock<Validator>()
  validator1Stub.validate.mockReturnValue(null)
  const validator2Stub = mock<Validator>()
  validator2Stub.validate.mockReturnValue(null)

  const validators = [validator1Stub, validator2Stub]
  const sut = new ValidatorComposite(validators)

  return {
    sut,
    validator1Stub,
    validator2Stub
  }
}

describe('ValidatorComposite', () => {
  test('should return an error if an validator fails', async () => {
    const { sut, validator2Stub } = makeSut()
    validator2Stub.validate.mockReturnValueOnce(new Error())

    const error = sut.validate({})
    expect(error).toEqual(new Error())
  })
  test('should return null if all validators pass', async () => {
    const { sut } = makeSut()

    const error = sut.validate({})
    expect(error).toBeNull()
  })
})
