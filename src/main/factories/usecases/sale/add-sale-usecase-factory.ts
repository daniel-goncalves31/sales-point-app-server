import { AddSaleUseCase } from '@/domain/usecases/sale/AddSaleUseCase'
import { DbAddSaleUseCase } from '@/data/usecases/sale/DbAddSaleUseCase'
import { SaleTypeOrmRepository } from '@/infra/db/typeorm/repositories/SaleTypeOrmRepository'

export const makeAddSaleDbUseCase = (): AddSaleUseCase => {
  const insertRepository = new SaleTypeOrmRepository()
  return new DbAddSaleUseCase(insertRepository)
}
