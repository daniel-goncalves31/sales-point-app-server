import { ProductModel } from '@/domain/models/product/ProductModel'

export interface UpdateProductRepository {
  update(product: ProductModel): Promise<void>
}
