import { UpdateSaleUseCase } from '@/domain/usecases/sale/UpdateSaleUseCase'
import { UpdateSaleRepository } from '@/data/protocols/db/sale/UpdateSaleRepository'
import { UpdateSaleModel } from '@/domain/models/sale/UpdateSaleModel'

export class DbUpdateSaleUseCase implements UpdateSaleUseCase {
  constructor (private readonly updateSaleRepository: UpdateSaleRepository) {}
  async update (saleData: UpdateSaleModel): Promise<void> {
    await this.updateSaleRepository.update(saleData)
  }
}
