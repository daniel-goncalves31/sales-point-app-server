import { ProductModel } from './ProductModel'

export interface NewProductModel {
  product: Omit<ProductModel, 'id'>
  purchasePrice: number
}
