import { DeleteProductController } from '@/presentation/controllers/product/DeleteProductController'
import { makeDeleteProductValidator } from '../../validators/product/delete-product-validator-factory'
import { makeDeleteProductUseCase } from '../../usecases/product/db-delete-product-factory'

export const makeDeleteProductController = (): DeleteProductController => {
  return new DeleteProductController(
    makeDeleteProductValidator(),
    makeDeleteProductUseCase()
  )
}
