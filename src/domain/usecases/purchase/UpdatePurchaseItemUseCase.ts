import { UpdatePurchaseItemModel } from '@/domain/models/purchase/UpdatePurchaseItemModel'

export interface UpdatePurchaseItemUseCase {
  update(item: UpdatePurchaseItemModel): Promise<void>
}