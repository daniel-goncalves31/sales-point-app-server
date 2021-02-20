import { Validator } from '@/presentation/protocols/Validator'
import { InvalidParamError } from '@/presentation/protocols/errors'

export class DateRangeValidator implements Validator {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error | null {
    const value = input[this.fieldName]

    if (value === '' || value === undefined) {
      return null
    }

    if (!value.includes(' - ')) {
      return new InvalidParamError(this.fieldName)
    }

    const startDate = new Date(value.split(' - ')[0])
    const endDate = new Date(value.split(' - ')[1])

    // date is not valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return new InvalidParamError(this.fieldName)
    }

    // end date is previous that the start date
    if (endDate.getTime() < startDate.getTime()) {
      return new InvalidParamError(this.fieldName)
    }

    return null
  }
}
