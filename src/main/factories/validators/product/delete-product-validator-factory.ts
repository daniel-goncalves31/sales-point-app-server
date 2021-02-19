import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'
import { RequiredFieldValidator } from '@/presentation/helpers/validators'

export const makeDeleteProductValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  validators.push(new RequiredFieldValidator('id'))

  return new ValidatorComposite(validators)
}
