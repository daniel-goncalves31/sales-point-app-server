import { UpdateProductUseCase } from '@/domain/usecases/product/UpdateProductUseCase'
import { DbUpdateProductUseCase } from '@/data/usecases/product/DbUpdateProductUseCase'
import { ProductTypeOrmRepository } from '@/infra/db/typeorm/repositories/ProductTypeOrmRepository'

export const makeUpdateProductUseCase = (): UpdateProductUseCase => {
  const updateProductRepository = new ProductTypeOrmRepository()
  return new DbUpdateProductUseCase(updateProductRepository)
}
