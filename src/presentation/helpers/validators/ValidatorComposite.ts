import { Validator } from '@/presentation/protocols/Validator'

export class ValidatorComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}

  validate (input: any): Error | null {
    if (Array.isArray(input)) {
      for (let i = 0; i < input.length; i++) {
        for (const validator of this.validators) {
          const error = validator.validate(input[i])

          if (error) return error
        }
      }
    } else {
      for (const validator of this.validators) {
        const error = validator.validate(input)

        if (error) return error
      }
    }

    return null
  }
}
