import { DeleteProductModel } from '@/domain/models/product/DeleteProductModel'

export interface DeleteProductUseCase {
  delete(deleteProductModel: DeleteProductModel): Promise<void>
}
