import { NewProductModel } from '@/domain/models/product/NewProductModel'
import { ProductPurchaseModel } from '@/domain/models/product/ProductPurchaseModel'

export interface InsertProductRepository {
  insert: (newProduct: NewProductModel, currentUserId: string) => Promise<ProductPurchaseModel>
}
