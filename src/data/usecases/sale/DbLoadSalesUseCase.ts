import { LoadSalesUseCase } from '@/domain/usecases/sale/LoadSalesUseCase'
import { LoadSaleParamsModel } from '@/domain/models/sale/LoadSaleParamsModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'
import { LoadSalesRepository } from '@/data/protocols/db/sale/LoadSalesRepository'

export class DbLoadSalesUseCase implements LoadSalesUseCase {
  constructor (private readonly loadSalesRepository: LoadSalesRepository) {}
  async load (salesParams: LoadSaleParamsModel): Promise<SaleModel[]> {
    return await this.loadSalesRepository.getSales(salesParams)
  }
}
