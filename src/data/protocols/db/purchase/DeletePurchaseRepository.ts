export interface DeletePurchaseRepository {
  remove(purchaseId: number): Promise<void>
}
