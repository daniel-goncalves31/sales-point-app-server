import { DeletePurchaseUseCase } from '@/domain/usecases/purchase/DeletePurchaseUseCase'
import { DbDeletePurchaseUseCase } from '@/data/usecases/purchase/DbDeletePurchaseUseCase'
import { PurchaseTypeOrmRepository } from '@/infra/db/typeorm/repositories/PurchaseTypeOrmRepository'

export const makeDeletePurchaseDbUseCase = (): DeletePurchaseUseCase => {
  const deletePurchaseRepository = new PurchaseTypeOrmRepository()
  return new DbDeletePurchaseUseCase(deletePurchaseRepository)
}
