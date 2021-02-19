import { UpdatePurchaseItemModel } from '@/domain/models/purchase/UpdatePurchaseItemModel'

export interface UpdatePurchaseItemRepository {
  updateItem(item: UpdatePurchaseItemModel): Promise<void>
}