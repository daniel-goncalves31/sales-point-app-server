import { NewPurchaseModel } from '@/domain/models/purchase/NewPurchaseModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'

export interface AddPurchaseUseCase {
  add(items: NewPurchaseModel, currentUserId: string): Promise<PurchaseModel>
}
