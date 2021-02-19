import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'
import { RequiredFieldValidator } from '@/presentation/helpers/validators'

export const makeUpdateSaleValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['id', 'userId', 'date']) {
    validators.push(new RequiredFieldValidator(field))
  }
  return new ValidatorComposite(validators)
}
