import { ProductModel } from '@/domain/models/product/ProductModel'

export interface UpdateProductUseCase {
  update(product: ProductModel): Promise<void>
}
