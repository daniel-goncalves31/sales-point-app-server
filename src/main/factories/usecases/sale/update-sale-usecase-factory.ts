import { UpdateSaleUseCase } from '@/domain/usecases/sale/UpdateSaleUseCase'
import { DbUpdateSaleUseCase } from '@/data/usecases/sale/DbUpdateSaleUseCase'
import { SaleTypeOrmRepository } from '@/infra/db/typeorm/repositories/SaleTypeOrmRepository'

export const makeUpdateSaleDbUseCase = (): UpdateSaleUseCase => {
  const updateSaleRepository = new SaleTypeOrmRepository()
  return new DbUpdateSaleUseCase(updateSaleRepository)
}
