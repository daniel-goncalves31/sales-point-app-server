import { SaleItemModel } from './SaleItemModel'
import { UserModel } from '../user/UserModel'

export enum SalePaymentType {
  MONEY = 0,
  DEBIT = 10,
  CREDIT_1 = 1,
  CREDIT_2 = 2,
  CREDIT_3 = 3,
  CREDIT_4 = 4,
  CREDIT_5 = 5,
  CREDIT_6 = 6
}

export interface SaleModel {
  id: number
  userId?: string
  user?: UserModel
  date: Date
  total: number
  items: SaleItemModel[],
  paymentType: SalePaymentType
}
