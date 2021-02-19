import { UpdateProductController } from '@/presentation/controllers/product/UpdateProductController'
import { makeUpdateProductValidator } from '../../validators/product/update-product-validator-factory'
import { makeUpdateProductUseCase } from '../../usecases/product/db-update-product-factory'

export const makeUpdateProductController = (): UpdateProductController => {
  return new UpdateProductController(
    makeUpdateProductValidator(),
    makeUpdateProductUseCase()
  )
}
