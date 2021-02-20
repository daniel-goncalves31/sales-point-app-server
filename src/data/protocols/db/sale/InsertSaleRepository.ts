import { NewSaleModel } from '@/domain/models/sale/NewSaleModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'

export interface InsertSaleRepository {
  insert(newSaleData: NewSaleModel): Promise<SaleModel>
}
