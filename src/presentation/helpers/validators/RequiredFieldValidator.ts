import { Validator } from '@/presentation/protocols/Validator'
import { MissingParamError } from '@/presentation/protocols/errors/MissingParamError'

export class RequiredFieldValidator implements Validator {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error | null {
    if (!input[this.fieldName] && input[this.fieldName] !== 0) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
