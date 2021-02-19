import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'
import { DateRangeValidator } from '@/presentation/helpers/validators/DateRangeValidator'

export const makeLoadPurchasesValidator = (): ValidatorComposite => {
  const validators: Validator[] = []

  validators.push(new DateRangeValidator('date'))

  return new ValidatorComposite(validators)
}
