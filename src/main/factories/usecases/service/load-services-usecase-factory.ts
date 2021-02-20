import { DbLoadServicesUseCase } from '@/data/usecases/service/DbLoadServicesUseCase'
import { LoadServicesUseCase } from '@/domain/usecases/service/LoadServicesUseCase'
import { ServiceTypeOrmRepository } from '@/infra/db/typeorm/repositories/ServiceTypeOrmRepository'

export const makeLoadServicesDbUseCase = (): LoadServicesUseCase => {
  const loadServicesRepository = new ServiceTypeOrmRepository()
  return new DbLoadServicesUseCase(loadServicesRepository)
}