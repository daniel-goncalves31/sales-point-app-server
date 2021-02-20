import { LoadPurchasesUseCase } from '@/domain/usecases/purchase/LoadPurchasesUseCase'
import { LoadPurchaseParamsModel } from '@/domain/models/purchase/LoadPurchaseParamsModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'
import { LoadPurchasesRepository } from '@/data/protocols/db/purchase/LoadPurchasesRepository'

export class DbLoadPurchasesUseCase implements LoadPurchasesUseCase {
  constructor (
    private readonly loadPurchasesRepository: LoadPurchasesRepository
  ) {}
  async load (
    purchasesParams: LoadPurchaseParamsModel
  ): Promise<PurchaseModel[]> {
    return await this.loadPurchasesRepository.getPurchases(purchasesParams)
  }
}
