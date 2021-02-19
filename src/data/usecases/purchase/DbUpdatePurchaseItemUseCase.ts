import { UpdatePurchaseItemUseCase } from '@/domain/usecases/purchase/UpdatePurchaseItemUseCase'
import { UpdatePurchaseItemRepository } from '@/data/protocols/db/purchase/UpdatePurchaseItemRepository'
import { UpdatePurchaseItemModel } from '@/domain/models/purchase/UpdatePurchaseItemModel'

export class DbUpdatePurchaseItemUseCase implements UpdatePurchaseItemUseCase {
  constructor(
    private readonly updatePurchaseItemRepository: UpdatePurchaseItemRepository
  ) { }

  async update(purchaseitem: UpdatePurchaseItemModel): Promise<void> {
    await this.updatePurchaseItemRepository.updateItem(purchaseitem)
  }
}
