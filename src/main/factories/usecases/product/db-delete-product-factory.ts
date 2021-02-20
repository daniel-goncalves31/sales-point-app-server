import { DeleteProductUseCase } from '@/domain/usecases/product/DeleteProductUseCase'
import { DbDeleteProductUseCase } from '@/data/usecases/product/DbDeleteProductUseCase'
import { ProductTypeOrmRepository } from '@/infra/db/typeorm/repositories/ProductTypeOrmRepository'

export const makeDeleteProductUseCase = (): DeleteProductUseCase => {
  const deleteProductRepository = new ProductTypeOrmRepository()
  return new DbDeleteProductUseCase(deleteProductRepository)
}
