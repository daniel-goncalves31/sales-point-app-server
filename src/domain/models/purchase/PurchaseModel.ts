import { PurchaseItemModel } from './PurchaseItemModel'
import { UserModel } from '../user/UserModel'

export interface PurchaseModel {
  id: number
  userId?: string
  user?: UserModel
  date: Date
  items: PurchaseItemModel[]
}
