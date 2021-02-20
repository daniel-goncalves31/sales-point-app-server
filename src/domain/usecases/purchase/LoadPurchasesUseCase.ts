import { LoadPurchaseParamsModel } from '@/domain/models/purchase/LoadPurchaseParamsModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'

export interface LoadPurchasesUseCase {
  load(params: LoadPurchaseParamsModel): Promise<PurchaseModel[]>
}
