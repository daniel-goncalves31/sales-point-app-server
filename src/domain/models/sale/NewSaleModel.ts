import { NewSaleItemModel } from './NewSaleItemModel'
import { SalePaymentType } from './SaleModel'

export interface NewSaleModel {
  userId: string,
  total: number,
  items: NewSaleItemModel[],
  paymentType: SalePaymentType
}
