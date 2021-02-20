import { AddPurchaseController } from '@/presentation/controllers/purchase/AddPurchaseController'
import { makeAddPurchaseValidator } from '../../validators/purchase/add-purchase-validator-controller'
import { makeAddPurchaseDbUseCase } from '../../usecases/purchase/add-purchase-usecase-factory'

export const makeAddPurchaseController = (): AddPurchaseController => {
  return new AddPurchaseController(
    makeAddPurchaseValidator(),
    makeAddPurchaseDbUseCase()
  )
}
