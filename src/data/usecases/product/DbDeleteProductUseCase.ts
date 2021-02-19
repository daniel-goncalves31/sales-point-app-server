import { DeleteProductUseCase } from '@/domain/usecases/product/DeleteProductUseCase'
import { DeleteProductModel } from '@/domain/models/product/DeleteProductModel'
import { DeleteProductRepository } from '@/data/protocols/db/product/DeleteProductRepository'

export class DbDeleteProductUseCase implements DeleteProductUseCase {
  constructor (
    private readonly deleteProductRepository: DeleteProductRepository
  ) {}
  async delete (deleteProductModel: DeleteProductModel): Promise<void> {
    await this.deleteProductRepository.remove(deleteProductModel)
  }
}
