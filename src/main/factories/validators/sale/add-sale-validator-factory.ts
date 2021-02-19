import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'
import { RequiredFieldValidator } from '@/presentation/helpers/validators'

export const makeAddSaleValidator = (): ValidatorComposite => {
  const validators: Validator[] = []

  for (const field of ['price']) {
    validators.push(new RequiredFieldValidator(field))
  }

  return new ValidatorComposite(validators)
}
