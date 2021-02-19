import { DeleteProductModel } from '@/domain/models/product/DeleteProductModel'

export interface DeleteProductRepository {
  remove(deletProductModel: DeleteProductModel): Promise<void>
}
