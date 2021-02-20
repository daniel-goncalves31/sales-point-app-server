import { NewPurchaseModel } from '@/domain/models/purchase/NewPurchaseModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'

export interface InsertPurchaseRepository {
  insert(items: NewPurchaseModel, currentUserId: string): Promise<PurchaseModel>
}
