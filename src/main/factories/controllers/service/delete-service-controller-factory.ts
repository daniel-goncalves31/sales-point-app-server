import { DeleteServiceController } from '@/presentation/controllers/service/DeleteServiceController'
import { makeDeleteServiceDbUseCase } from '../../usecases/service/delete-service-usecase-factory'
import { makeDeleteServiceValidator } from '../../validators/service/delete-service-validator'

export const makeDeleteServiceController = (): DeleteServiceController => {
  return new DeleteServiceController(makeDeleteServiceValidator(), makeDeleteServiceDbUseCase())
}