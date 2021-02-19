export interface DeletePurchaseUseCase {
  delete(purchaseId: number): Promise<void>
}
