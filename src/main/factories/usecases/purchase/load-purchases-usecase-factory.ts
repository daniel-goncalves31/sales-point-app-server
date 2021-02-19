import { LoadPurchasesUseCase } from '@/domain/usecases/purchase/LoadPurchasesUseCase'
import { PurchaseTypeOrmRepository } from '@/infra/db/typeorm/repositories/PurchaseTypeOrmRepository'
import { DbLoadPurchasesUseCase } from '@/data/usecases/purchase/DbLoadPuchasesUseCase'

export const makeLoadPurchasesDbUseCase = (): LoadPurchasesUseCase => {
  const getPurchasesRepository = new PurchaseTypeOrmRepository()
  return new DbLoadPurchasesUseCase(getPurchasesRepository)
}
