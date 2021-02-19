import { AddPurchaseUseCase } from '@/domain/usecases/purchase/AddPurchaseUseCase'
import { DbAddPurchaseUseCase } from '@/data/usecases/purchase/DbAddPurchaseUseCase'
import { PurchaseTypeOrmRepository } from '@/infra/db/typeorm/repositories/PurchaseTypeOrmRepository'

export const makeAddPurchaseDbUseCase = (): AddPurchaseUseCase => {
  const insertRepository = new PurchaseTypeOrmRepository()
  return new DbAddPurchaseUseCase(insertRepository)
}
