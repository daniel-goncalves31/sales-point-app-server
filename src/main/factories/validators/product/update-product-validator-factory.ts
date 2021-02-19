import { LessOrEqualValidator } from '@/presentation/helpers/validators/LessOrEqualValidator'
import { RequiredFieldValidator } from '@/presentation/helpers/validators'
import { Validator } from '@/presentation/protocols/Validator'
import { ValidatorComposite } from '@/presentation/helpers/validators/ValidatorComposite'

export const makeUpdateProductValidator = (): ValidatorComposite => {
  const validators: Validator[] = []

  for (const field of [
    'id',
    'name',
    'brand',
    'price',
    'quantity',
    'minQuantity',
    'status'
  ]) {
    validators.push(new RequiredFieldValidator(field))
  }
  validators.push(new LessOrEqualValidator('quantity', 'minQuantity'))

  return new ValidatorComposite(validators)
}
