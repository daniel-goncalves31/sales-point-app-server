import { AddPurchaseUseCase } from '@/domain/usecases/purchase/AddPurchaseUseCase'
import { NewPurchaseModel } from '@/domain/models/purchase/NewPurchaseModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'
import { InsertPurchaseRepository } from '@/data/protocols/db/purchase/InsertPurchaseRepository'

export class DbAddPurchaseUseCase implements AddPurchaseUseCase {
  constructor (
    private readonly insertPurchaseRepository: InsertPurchaseRepository
  ) {}

  async add (
    items: NewPurchaseModel,
    currentUserId: string
  ): Promise<PurchaseModel> {
    return await this.insertPurchaseRepository.insert(items, currentUserId)
  }
}
