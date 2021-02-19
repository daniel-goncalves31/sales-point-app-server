import { LoadPurchaseParamsModel } from '@/domain/models/purchase/LoadPurchaseParamsModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'

export interface LoadPurchasesRepository {
  getPurchases(
    purchasesParams: LoadPurchaseParamsModel
  ): Promise<PurchaseModel[]>
}
