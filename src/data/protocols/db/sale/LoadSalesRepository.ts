import { LoadSaleParamsModel } from '@/domain/models/sale/LoadSaleParamsModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'

export interface LoadSalesRepository {
  getSales(salesParams: LoadSaleParamsModel): Promise<SaleModel[]>
}
