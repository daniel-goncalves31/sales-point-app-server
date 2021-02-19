import { LoadServicesController } from '@/presentation/controllers/service/LoadServicesController'
import { makeLoadServicesDbUseCase } from '../../usecases/service/load-services-usecase-factory'

export const makeLoadServicesController = (): LoadServicesController => {
  return new LoadServicesController(makeLoadServicesDbUseCase())
}