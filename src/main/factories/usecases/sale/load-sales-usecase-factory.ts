import { LoadSalesUseCase } from '@/domain/usecases/sale/LoadSalesUseCase'
import { DbLoadSalesUseCase } from '@/data/usecases/sale/DbLoadSalesUseCase'
import { SaleTypeOrmRepository } from '@/infra/db/typeorm/repositories/SaleTypeOrmRepository'

export const makeLoadSalesDbUseCase = (): LoadSalesUseCase => {
  const getSalesRepository = new SaleTypeOrmRepository()
  return new DbLoadSalesUseCase(getSalesRepository)
}
