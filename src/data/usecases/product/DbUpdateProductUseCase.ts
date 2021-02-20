import { UpdateProductUseCase } from '@/domain/usecases/product/UpdateProductUseCase'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { UpdateProductRepository } from '@/data/protocols/db/product/UpdateProductRepository'

export class DbUpdateProductUseCase implements UpdateProductUseCase {
  constructor (
    private readonly updateProductRepository: UpdateProductRepository
  ) {}

  async update (product: ProductModel): Promise<void> {
    await this.updateProductRepository.update(product)
  }
}
