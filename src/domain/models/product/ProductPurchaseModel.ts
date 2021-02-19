import { ProductModel } from './ProductModel'
import { PurchaseModel } from '../purchase/PurchaseModel'

export interface ProductPurchaseModel {
  product: ProductModel,
  purchase: PurchaseModel
}