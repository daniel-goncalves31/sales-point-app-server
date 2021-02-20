import { ProductModel } from '@/domain/models/product/ProductModel'

export interface LoadProductsUseCase {
  load(): Promise<ProductModel[]>
}
