import { LoadSalesController } from '@/presentation/controllers/sale/LoadSalesController'
import { makeLoadSalesValidator } from '../../validators/sale/load-sales-validator-factory'
import { makeLoadSalesDbUseCase } from '../../usecases/sale/load-sales-usecase-factory'

export const makeLoadSalesController = (): LoadSalesController => {
  return new LoadSalesController(
    makeLoadSalesValidator(),
    makeLoadSalesDbUseCase()
  )
}
