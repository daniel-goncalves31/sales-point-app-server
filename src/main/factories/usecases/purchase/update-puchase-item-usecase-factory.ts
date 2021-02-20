import { DbUpdatePurchaseItemUseCase } from '@/data/usecases/purchase/DbUpdatePurchaseItemUseCase'
import { UpdatePurchaseItemUseCase } from '@/domain/usecases/purchase/UpdatePurchaseItemUseCase'
import { PurchaseTypeOrmRepository } from '@/infra/db/typeorm/repositories/PurchaseTypeOrmRepository'

export const makeUpdatePurchaseItemDbUseCase = (): UpdatePurchaseItemUseCase => {
  const updatePurchaseItemRepository = new PurchaseTypeOrmRepository()
  return new DbUpdatePurchaseItemUseCase(updatePurchaseItemRepository)
}