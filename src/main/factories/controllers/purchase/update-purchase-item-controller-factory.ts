import { UpdatePurchaseItemController } from '@/presentation/controllers/purchase/UpdatePurchaseItemController'
import { makeUpdatePurchaseItemDbUseCase } from '../../usecases/purchase/update-puchase-item-usecase-factory'
import { makeUpdatePurchaseItemValidator } from '../../validators/purchase/update-purchase-item-validator-factory'

export const makeUpdatePurchaseItemController = (): UpdatePurchaseItemController => {

  return new UpdatePurchaseItemController(makeUpdatePurchaseItemValidator(), makeUpdatePurchaseItemDbUseCase())
}