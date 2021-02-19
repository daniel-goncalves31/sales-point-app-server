import { DeletePurchaseUseCase } from '@/domain/usecases/purchase/DeletePurchaseUseCase'
import { DeletePurchaseRepository } from '@/data/protocols/db/purchase/DeletePurchaseRepository'

export class DbDeletePurchaseUseCase implements DeletePurchaseUseCase {
  constructor (
    private readonly deletePurchaseRepository: DeletePurchaseRepository
  ) {}
  async delete (purchaseId: number): Promise<void> {
    await this.deletePurchaseRepository.remove(purchaseId)
  }
}
