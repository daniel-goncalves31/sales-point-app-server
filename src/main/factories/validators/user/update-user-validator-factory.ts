import { RequiredFieldValidator } from '@/presentation/helpers/validators'
import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'

export const makeUpdateUserValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const fieldName of ['id', 'username', 'name', 'role', 'status']) {
    validators.push(new RequiredFieldValidator(fieldName))
  }
  return new ValidatorComposite(validators)
}