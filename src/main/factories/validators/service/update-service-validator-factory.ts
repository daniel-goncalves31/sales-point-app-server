import { RequiredFieldValidator } from '@/presentation/helpers/validators'
import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'

export const makeUpdateServiceValidator = (): ValidatorComposite => {
  const validators: Validator[] = []

  for (const fieldName of ['id', 'name', 'brand']) {
    validators.push(new RequiredFieldValidator(fieldName))
  }
  return new ValidatorComposite(validators)
}