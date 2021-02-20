import { Controller } from '@/presentation/protocols/Controller'
import { AddProductController } from '@/presentation/controllers/product/AddProductController'
import { makeAddProductValidator } from '../../validators/product/add-product-validator-factory'
import { makeAddProductUseCase } from '../../usecases/product/db-add-product-factory'

export const makeAddProductController = (): Controller => {
  return new AddProductController(
    makeAddProductValidator(),
    makeAddProductUseCase()
  )
}
