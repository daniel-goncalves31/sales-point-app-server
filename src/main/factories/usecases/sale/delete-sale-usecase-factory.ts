import { DeleteSaleUseCase } from '@/domain/usecases/sale/DeleteSaleUseCase'
import { DbDeleteSaleUseCase } from '@/data/usecases/sale/DbDeleteSaleUseCase'
import { SaleTypeOrmRepository } from '@/infra/db/typeorm/repositories/SaleTypeOrmRepository'

export const makeDeleteSaleDbUseCase = (): DeleteSaleUseCase => {
  const deleteSaleRepository = new SaleTypeOrmRepository()
  return new DbDeleteSaleUseCase(deleteSaleRepository)
}
