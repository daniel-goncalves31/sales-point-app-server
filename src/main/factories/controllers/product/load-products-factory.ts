import { LoadProductsController } from '@/presentation/controllers/product/LoadProductsController'
import { makeLoadProductsUseCase } from '../../usecases/product/db-load-products-factory'

export const makeLoadProductsController = (): LoadProductsController => {
  return new LoadProductsController(makeLoadProductsUseCase())
}
