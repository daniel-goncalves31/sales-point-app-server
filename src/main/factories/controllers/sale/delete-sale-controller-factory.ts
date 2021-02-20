import { Controller } from '@/presentation/protocols/Controller'
import { DeleteSaleController } from '@/presentation/controllers/sale/DeleteSaleController'
import { makeDeleteSaleValidator } from '../../validators/sale/delete-sale-validator-factory'
import { makeDeleteSaleDbUseCase } from '../../usecases/sale/delete-sale-usecase-factory'

export const makeDeleteSaleController = (): Controller => {
  return new DeleteSaleController(
    makeDeleteSaleValidator(),
    makeDeleteSaleDbUseCase()
  )
}
