import { DbAddServiceUseCase } from '@/data/usecases/service/DbAddServiceUseCase'
import { AddServiceUseCase } from '@/domain/usecases/service/AddServiceUseCase'
import { ServiceTypeOrmRepository } from '@/infra/db/typeorm/repositories/ServiceTypeOrmRepository'

export const makeAddServiceDbUseCase = (): AddServiceUseCase => {

  const insertServiceRepository = new ServiceTypeOrmRepository()
  return new DbAddServiceUseCase(insertServiceRepository)
}