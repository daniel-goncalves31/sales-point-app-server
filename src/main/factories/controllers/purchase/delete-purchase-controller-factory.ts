import { Controller } from '@/presentation/protocols/Controller'
import { DeletePurchaseController } from '@/presentation/controllers/purchase/DeletePurchaseController'
import { makeDeletePurchaseValidator } from '../../validators/purchase/delete-purchase-validator-factory'
import { makeDeletePurchaseDbUseCase } from '../../usecases/purchase/delete-purchase-usecase-factory'

export const makeDeletePurchaseController = (): Controller => {
  return new DeletePurchaseController(
    makeDeletePurchaseValidator(),
    makeDeletePurchaseDbUseCase()
  )
}
