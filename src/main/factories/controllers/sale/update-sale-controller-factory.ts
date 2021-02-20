import { Controller } from '@/presentation/protocols/Controller'
import { UpdateSaleController } from '@/presentation/controllers/sale/UpdateSaleController'
import { makeUpdateSaleValidator } from '../../validators/sale/update-sale-validator-factory'
import { makeUpdateSaleDbUseCase } from '../../usecases/sale/update-sale-usecase-factory'
export const makeUpdateSaleController = (): Controller => {
  return new UpdateSaleController(
    makeUpdateSaleValidator(),
    makeUpdateSaleDbUseCase()
  )
}
