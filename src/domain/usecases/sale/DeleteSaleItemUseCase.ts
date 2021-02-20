export interface DeleteSaleItemUseCase {
  delete(saleItemId: number): Promise<void>
}