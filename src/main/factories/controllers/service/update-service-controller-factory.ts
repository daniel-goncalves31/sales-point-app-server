import { UpdateServiceController } from '@/presentation/controllers/service/UpdateServiceController'
import { makeUpdateServiceDbUseCase } from '../../usecases/service/update-service-usecase-factory'
import { makeUpdateServiceValidator } from '../../validators/service/update-service-validator-factory'

export const makeUpdateServiceController = (): UpdateServiceController => {
  return new UpdateServiceController(makeUpdateServiceValidator(), makeUpdateServiceDbUseCase())
}