import { Validator } from '@/presentation/protocols/Validator'
import { InvalidParamError } from '@/presentation/protocols/errors'

export class LessOrEqualValidator implements Validator {
  constructor (
    private readonly fieldToCompareName: string,
    private readonly fieldName: string
  ) {}

  validate (input: any): Error | null {
    if (
      !(
        parseInt(input[this.fieldName]) <=
        parseInt(input[this.fieldToCompareName])
      )
    ) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
