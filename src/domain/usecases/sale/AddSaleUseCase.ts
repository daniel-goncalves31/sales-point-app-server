import { NewSaleModel } from '@/domain/models/sale/NewSaleModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'

export interface AddSaleUseCase {
  add(saleData: NewSaleModel): Promise<SaleModel>
}
