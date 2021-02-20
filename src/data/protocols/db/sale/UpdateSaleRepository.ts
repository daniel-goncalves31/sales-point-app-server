import { UpdateSaleModel } from '@/domain/models/sale/UpdateSaleModel'

export interface UpdateSaleRepository {
  update(saleData: UpdateSaleModel): Promise<void>
}
