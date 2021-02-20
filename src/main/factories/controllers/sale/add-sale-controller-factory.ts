import { AddSaleController } from '@/presentation/controllers/sale/AddSaleController'
import { makeAddSaleValidator } from '../../validators/sale/add-sale-validator-factory'
import { makeAddSaleDbUseCase } from '../../usecases/sale/add-sale-usecase-factory'

export const makeAddSaleController = (): AddSaleController => {
  return new AddSaleController(makeAddSaleValidator(), makeAddSaleDbUseCase())
}
