import { LoadProductsUseCase } from '@/domain/usecases/product/LoadProductsUseCase'
import { LoadProductsRepository } from '@/data/protocols/db/product/LoadProductsRepository'
import { ProductModel } from '@/domain/models/product/ProductModel'

export class DbLoadProductsUseCase implements LoadProductsUseCase {
  constructor (
    private readonly loadProductsRepository: LoadProductsRepository
  ) {}

  async load (): Promise<ProductModel[]> {
    return await this.loadProductsRepository.getAllProducts()
  }
}
