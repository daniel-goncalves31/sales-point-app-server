import { AddProductUseCase } from '@/domain/usecases/product/AddProductUseCase'
import { ProductTypeOrmRepository } from '@/infra/db/typeorm/repositories/ProductTypeOrmRepository'
import { DbAddProductUseCase } from '@/data/usecases/product/DbAddProductUseCase'

export const makeAddProductUseCase = (): AddProductUseCase => {
  const addProductRepository = new ProductTypeOrmRepository()
  return new DbAddProductUseCase(addProductRepository)
}
