import { UpdateSaleModel } from '@/domain/models/sale/UpdateSaleModel'

export interface UpdateSaleUseCase {
  update(saleData: UpdateSaleModel): Promise<void>
}
