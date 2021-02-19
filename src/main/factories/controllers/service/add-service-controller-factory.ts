import { AddServiceController } from '@/presentation/controllers/service/AddServiceController'
import { makeAddServiceDbUseCase } from '../../usecases/service/add-service-usecase-factory'
import { makeAddServiceValidator } from '../../validators/service/add-service-validator-factory'

export const makeAddServiceController = (): AddServiceController => {

  return new AddServiceController(makeAddServiceValidator(), makeAddServiceDbUseCase())
}