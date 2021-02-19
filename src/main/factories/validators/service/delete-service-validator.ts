import { RequiredFieldValidator } from '@/presentation/helpers/validators'
import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'

export const makeDeleteServiceValidator = (): ValidatorComposite => {
  const validators: Validator[] = []

  for (const fieldName of ['id']) {
    validators.push(new RequiredFieldValidator(fieldName))
  }

  return new ValidatorComposite(validators)
}