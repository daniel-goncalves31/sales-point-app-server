export interface DeleteSaleUseCase {
  delete(saleId: number): Promise<void>
}
