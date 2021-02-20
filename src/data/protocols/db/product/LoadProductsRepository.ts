import { ProductModel } from '@/domain/models/product/ProductModel'

export interface LoadProductsRepository {
  getAllProducts(): Promise<ProductModel[]>
}
