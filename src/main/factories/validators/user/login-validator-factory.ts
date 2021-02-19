import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'
import { RequiredFieldValidator } from '@/presentation/helpers/validators'

export const makeLoginValidator = (): ValidatorComposite => {
  const validations: Validator[] = []

  for (const field of ['username', 'password']) {
    validations.push(new RequiredFieldValidator(field))
  }
  return new ValidatorComposite(validations)
}
