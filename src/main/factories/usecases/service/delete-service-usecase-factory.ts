import { DbDeleteServiceUseCase } from '@/data/usecases/service/DbDeleteServiceUseCase'
import { DeleteServiceUseCase } from '@/domain/usecases/service/DeleteServiceUseCase'
import { ServiceTypeOrmRepository } from '@/infra/db/typeorm/repositories/ServiceTypeOrmRepository'

export const makeDeleteServiceDbUseCase = (): DeleteServiceUseCase => {
  const deleteServiceRepository = new ServiceTypeOrmRepository()
  return new DbDeleteServiceUseCase(deleteServiceRepository)
}