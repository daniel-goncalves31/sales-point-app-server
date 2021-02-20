import { ProductModel } from '../product/ProductModel'
import { SaleModel } from './SaleModel'
import { ServiceModel } from '../service/ServiceModel'

export interface SaleItemModel {
  id: number
  saleId?: number
  sale?: SaleModel
  product?: ProductModel
  productId?: number
  service?: ServiceModel
  serviceId?: number
  price: number
  quantity: number
  purchasePrice?: number
}
