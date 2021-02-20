import { LoadSaleParamsModel } from '@/domain/models/sale/LoadSaleParamsModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'

export interface LoadSalesUseCase {
  load(params: LoadSaleParamsModel): Promise<SaleModel[]>
}
