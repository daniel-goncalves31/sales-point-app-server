import { RequiredFieldValidator } from '@/presentation/helpers/validators'
import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'

export const makeUpdatePurchaseItemValidator = (): ValidatorComposite => {
  const validators: Validator[] = []

  for (const fieldName of ['id', 'productId', 'quantity', 'price']) {
    validators.push(new RequiredFieldValidator(fieldName))
  }
  return new ValidatorComposite(validators)
}