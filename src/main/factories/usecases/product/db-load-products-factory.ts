import { LoadProductsUseCase } from '@/domain/usecases/product/LoadProductsUseCase'
import { DbLoadProductsUseCase } from '@/data/usecases/product/DbLoadProductsUseCase'
import { ProductTypeOrmRepository } from '@/infra/db/typeorm/repositories/ProductTypeOrmRepository'

export const makeLoadProductsUseCase = (): LoadProductsUseCase => {
  const loadProductsRepository = new ProductTypeOrmRepository()
  return new DbLoadProductsUseCase(loadProductsRepository)
}
