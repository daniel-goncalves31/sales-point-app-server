import { DeleteSaleUseCase } from '@/domain/usecases/sale/DeleteSaleUseCase'
import { DeleteSaleRepository } from '@/data/protocols/db/sale/DeleteSaleRepository'

export class DbDeleteSaleUseCase implements DeleteSaleUseCase {
  constructor (private readonly deleteSaleRepository: DeleteSaleRepository) {}
  async delete (saleId: number): Promise<void> {
    await this.deleteSaleRepository.remove(saleId)
  }
}
