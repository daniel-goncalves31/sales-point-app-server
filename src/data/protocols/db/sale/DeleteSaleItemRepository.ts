export interface DeleteSaleItemRepository {
  removeItem(saleId: number): Promise<void>
}
