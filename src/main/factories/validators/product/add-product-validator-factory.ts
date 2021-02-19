import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'
import { Validator } from '@/presentation/protocols/Validator'
import { RequiredFieldValidator } from '@/presentation/helpers/validators'
import { LessOrEqualValidator } from '@/presentation/helpers/validators/LessOrEqualValidator'

export const makeAddProductValidator = (): ValidatorComposite => {
  const validators: Validator[] = []

  for (const field of ['name', 'brand', 'price', 'quantity', 'minQuantity', 'purchasePrice']) {
    validators.push(new RequiredFieldValidator(field))
  }

  validators.push(new LessOrEqualValidator('quantity', 'minQuantity'))

  return new ValidatorComposite(validators)
}
