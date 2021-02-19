import { DbUpdateServiceUseCase } from '@/data/usecases/service/DbUpdateServiceUseCase'
import { UpdateServiceUseCase } from '@/domain/usecases/service/UpdateServiceUseCase'
import { ServiceTypeOrmRepository } from '@/infra/db/typeorm/repositories/ServiceTypeOrmRepository'

export const makeUpdateServiceDbUseCase = (): UpdateServiceUseCase => {
  const updateServiceRepository = new ServiceTypeOrmRepository()
  return new DbUpdateServiceUseCase(updateServiceRepository)
}