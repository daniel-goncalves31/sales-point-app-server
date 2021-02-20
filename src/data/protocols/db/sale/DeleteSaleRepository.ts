export interface DeleteSaleRepository {
  remove(saleId: number): Promise<void>
}
