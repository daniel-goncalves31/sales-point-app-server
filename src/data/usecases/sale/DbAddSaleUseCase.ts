import { AddSaleUseCase } from '@/domain/usecases/sale/AddSaleUseCase'
import { NewSaleModel } from '@/domain/models/sale/NewSaleModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'
import { InsertSaleRepository } from '@/data/protocols/db/sale/InsertSaleRepository'

export class DbAddSaleUseCase implements AddSaleUseCase {
  constructor (private readonly insertSaleRepository: InsertSaleRepository) {}

  async add (newSaleData: NewSaleModel): Promise<SaleModel> {
    return await this.insertSaleRepository.insert(newSaleData)
  }
}
