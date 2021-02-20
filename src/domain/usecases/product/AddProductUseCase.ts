import { NewProductModel } from '@/domain/models/product/NewProductModel'
import { ProductPurchaseModel } from '@/domain/models/product/ProductPurchaseModel'

export interface AddProductUseCase {
  add(product: NewProductModel, currentUserId: string): Promise<ProductPurchaseModel>
}
