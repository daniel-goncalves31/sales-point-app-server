import { InsertProductRepository } from '@/data/protocols/db/product/InsertProductRepository'
import { NewProductModel } from '@/domain/models/product/NewProductModel'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { getRepository } from 'typeorm'
import { ProductEntity } from '../entities/ProductEntity'
import { UpdateProductRepository } from '@/data/protocols/db/product/UpdateProductRepository'
import { DeleteProductRepository } from '@/data/protocols/db/product/DeleteProductRepository'
import { DeleteProductModel } from '@/domain/models/product/DeleteProductModel'
import { LoadProductsRepository } from '@/data/protocols/db/product/LoadProductsRepository'
import { PurchaseEntity } from '../entities/PurchaseEntity'
import { PurchaseItemEntity } from '../entities/PurchaseItemEntity'
import { ProductPurchaseModel } from '@/domain/models/product/ProductPurchaseModel'
import { SaleEntity } from '../entities/SaleEntity'

export class ProductTypeOrmRepository
  implements
    InsertProductRepository,
    UpdateProductRepository,
    DeleteProductRepository,
    LoadProductsRepository {
  async insert (newData: NewProductModel, currentUserId: string): Promise<ProductPurchaseModel> {
    const repository = getRepository<ProductModel>(ProductEntity)
    const product = await repository.save(newData.product)

    const purchase = await getRepository(PurchaseEntity).save({
      userId: currentUserId,
      date: new Date().toISOString()
    })

    
    const newPurchaseItem = {
      purchaseId: purchase.id,
      price: newData.purchasePrice,
      productId: product.id,
      quantity: product.quantity,
      purchasePrice: 2
    }

    await getRepository(PurchaseItemEntity).save(newPurchaseItem)

    const addedPurchase = await getRepository(PurchaseEntity)
      .createQueryBuilder('purchases')
      .addSelect('users.name')
      .addSelect('purchase_items.id')
      .addSelect('purchase_items.price')
      .addSelect('purchase_items.quantity')
      .addSelect('products.id')
      .addSelect('products.name')
      .addSelect('products.brand')
      .leftJoin('purchases.user', 'users')
      .leftJoin('purchases.items', 'purchase_items')
      .leftJoin('purchase_items.product', 'products')
      .where({ id: purchase.id })
      .getOne()

    return {
      product,
      purchase: addedPurchase!
    }

  }

  async update (product: ProductModel): Promise<void> {
    const repository = getRepository<ProductModel>(ProductEntity)
    await repository.save(product)
  }

  async remove (deleteProduct: DeleteProductModel): Promise<void> {
    const repository = getRepository<ProductModel>(ProductEntity)
    await repository.delete(deleteProduct)

    await getRepository(SaleEntity).query('DELETE FROM sales WHERE NOT EXISTS (SELECT id FROM sale_items WHERE sale_items."saleId" = sales.id)')

    await getRepository(PurchaseEntity).query('DELETE FROM purchases WHERE NOT EXISTS (SELECT id FROM purchase_items WHERE purchase_items."purchaseId" = purchases.id)')
  }

  async getAllProducts (): Promise<ProductModel[]> {
    const repository = getRepository<ProductModel>(ProductEntity)
    return await repository.find()
  }
}
