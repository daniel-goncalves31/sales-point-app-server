import { InvalidCodeError } from '@/presentation/protocols/errors/InvalidCodeError'
import { Validator } from '@/presentation/protocols/Validator'

export class IsCodeValidator implements Validator {
  constructor(private readonly length: number) {}
  validate(code: string): InvalidCodeError | null {
    if (code.length !== this.length || isNaN(Number(code))) {
      return new InvalidCodeError(code)
    }
    return null
  }
}
