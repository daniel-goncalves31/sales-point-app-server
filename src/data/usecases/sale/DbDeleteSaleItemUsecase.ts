import { DeleteSaleItemRepository } from '@/data/protocols/db/sale/DeleteSaleItemRepository'
import { DeleteSaleItemUseCase } from '@/domain/usecases/sale/DeleteSaleItemUseCase'

export class DbDeleteSaleItemUseCase implements DeleteSaleItemUseCase {
  constructor(private readonly deleteSaleItemRepository: DeleteSaleItemRepository) { }
  async delete(saleitemId: number): Promise<void> {
    await this.deleteSaleItemRepository.removeItem(saleitemId)
  }
}
