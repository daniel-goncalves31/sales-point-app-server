import { AddProductUseCase } from '@/domain/usecases/product/AddProductUseCase'
import { NewProductModel } from '@/domain/models/product/NewProductModel'
import { InsertProductRepository } from '@/data/protocols/db/product/InsertProductRepository'
import { ProductPurchaseModel } from '@/domain/models/product/ProductPurchaseModel'

export class DbAddProductUseCase implements AddProductUseCase {
  constructor (
    private readonly inserProductRepository: InsertProductRepository
  ) {}

  async add (product: NewProductModel, currentUserId: string): Promise<ProductPurchaseModel> {
    return this.inserProductRepository.insert(product, currentUserId)
  }
}
