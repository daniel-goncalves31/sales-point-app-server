import { LoadPurchasesController } from '@/presentation/controllers/purchase/LoadPurchasesController'
import { makeLoadPurchasesValidator } from '../../validators/purchase/load-purchases-validator-factory'
import { makeLoadPurchasesDbUseCase } from '../../usecases/purchase/load-purchases-usecase-factory'

export const makeLoadPurchasesController = (): LoadPurchasesController => {
  return new LoadPurchasesController(
    makeLoadPurchasesValidator(),
    makeLoadPurchasesDbUseCase()
  )
}
