import { ProductModel } from '../product/ProductModel'
import { PurchaseModel } from './PurchaseModel'

export interface PurchaseItemModel {
  id: number
  purchaseId?: number
  purchase?: PurchaseModel
  product?: ProductModel
  productId?: number
  price: number
  quantity: number
}
