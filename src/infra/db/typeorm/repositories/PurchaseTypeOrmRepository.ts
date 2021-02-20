import { Brackets, In, getRepository } from 'typeorm'

import { DeletePurchaseRepository } from '@/data/protocols/db/purchase/DeletePurchaseRepository'
import { InsertPurchaseRepository } from '@/data/protocols/db/purchase/InsertPurchaseRepository'
import { LoadPurchaseParamsModel } from '@/domain/models/purchase/LoadPurchaseParamsModel'
import { LoadPurchasesRepository } from '@/data/protocols/db/purchase/LoadPurchasesRepository'
import { NewPurchaseModel } from '@/domain/models/purchase/NewPurchaseModel'
import { ProductEntity } from '../entities/ProductEntity'
import { PurchaseEntity } from '../entities/PurchaseEntity'
import { PurchaseItemEntity } from '../entities/PurchaseItemEntity'
import { PurchaseItemModel } from '@/domain/models/purchase/PurchaseItemModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'
import { UpdatePurchaseItemModel } from '@/domain/models/purchase/UpdatePurchaseItemModel'
import { UpdatePurchaseItemRepository } from '@/data/protocols/db/purchase/UpdatePurchaseItemRepository'

export class PurchaseTypeOrmRepository
  implements
  InsertPurchaseRepository,
  LoadPurchasesRepository,
  DeletePurchaseRepository,
  UpdatePurchaseItemRepository {
  async insert(
    newPurchase: NewPurchaseModel,
    currentUserId: string
  ): Promise<PurchaseModel> {
    const purchaseRep = getRepository(PurchaseEntity)
    const purchase = await purchaseRep.save({
      userId: currentUserId,
      date: new Date().toISOString()
    })

    const itemRepo = getRepository<PurchaseItemModel>(PurchaseItemEntity)
    const items = newPurchase.items.map(item => ({
      ...item,
      purchaseId: purchase.id
    }))
    await itemRepo.save(items)

    for (let i = 0; i < items.length; i++) {
      let product = await getRepository(ProductEntity).findOne({
        id: items[i].productId
      })

      const newQuantity = product!.quantity + items[i].quantity
      product!.quantity = newQuantity
      await getRepository(ProductEntity).save(product!)
      product = await getRepository(ProductEntity).findOne({
        id: items[i].productId
      })
    }

    const addedPurchase = await purchaseRep
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

    return addedPurchase!
  }

  async getPurchases(purchasesParams: LoadPurchaseParamsModel): Promise<PurchaseModel[]> {
    const query = getRepository(PurchaseEntity)
      .createQueryBuilder('purchases')
      .select('purchases.id')
      .leftJoin('purchases.user', 'users')
      .leftJoin('purchases.items', 'purchase_items')
      .leftJoin('purchase_items.product', 'products')

    if (purchasesParams.date && purchasesParams.filter) {
      const startDate = purchasesParams.date.split(' - ')[0]

      const endDate = new Date(purchasesParams.date.split(' - ')[1])
      endDate.setDate(endDate.getDate() + 1)

      query
      query
        .where('purchases.date BETWEEN :startDate AND :endDate', {
          startDate,
          endDate: endDate.toISOString()
        })
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere(
              'LOWER(products.name) LIKE :filter OR LOWER(products.brand) LIKE :filter',
              {
                filter: `${purchasesParams.filter?.toLowerCase()}%`
              }
            )
          })
        )
    } else if (purchasesParams.date) {
      const startDate = purchasesParams.date.split(' - ')[0]

      const endDate = new Date(purchasesParams.date.split(' - ')[1])
      endDate.setDate(endDate.getDate() + 1)

      query.where('purchases.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate: endDate.toISOString()
      })
    } else if (purchasesParams.filter) {
      query.where(
        'LOWER(products.name) LIKE :filter OR LOWER(products.brand) LIKE :filter',
        {
          filter: `${purchasesParams.filter.toLowerCase()}%`
        }
      )
    }

    const purchasesIds = await query.getMany()
    const ids = purchasesIds.map(purchase => purchase.id)

    const purchases = await getRepository(PurchaseEntity)
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
      .where({ id: In(ids) })
      .orderBy('purchases.date', 'DESC')
      .limit(30)
      .getMany()

    return purchases
  }

  async remove(purchaseId: number): Promise<void> {

    const items = await getRepository(PurchaseItemEntity)
      .createQueryBuilder('purchase_items')
      .select('purchase_items.quantity')
      .addSelect('products.id')
      .addSelect('products.quantity')
      .leftJoin('purchase_items.product', 'products')
      .where('"purchaseId" = :id', { id: purchaseId })
      .getMany()

    for (let i = 0; i < items.length; i++) {
      const product = items[i].product

      const newQuantity = product.quantity - items[i].quantity
      product.quantity = newQuantity

      await getRepository(ProductEntity).save(product)

    }

    await getRepository(PurchaseItemEntity)
      .createQueryBuilder()
      .delete()
      .where('purchaseId = :id', { id: purchaseId })
      .execute()

    await getRepository(PurchaseEntity)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: purchaseId })
      .execute()
  }

  async updateItem(itemData: UpdatePurchaseItemModel): Promise<void> {

    const oldItem = await getRepository(PurchaseItemEntity).findOne({ where: { id: itemData.id } })
    const oldProduct = await getRepository(ProductEntity).findOne({ where: { id: oldItem!.productId } })

    oldProduct!.quantity -= oldItem!.quantity
    await getRepository(ProductEntity).save(oldProduct!)

    const newProduct = await getRepository(ProductEntity).findOne({ where: { id: itemData.productId } })
    newProduct!.quantity += itemData!.quantity
    await getRepository(ProductEntity).save(newProduct!)

    await getRepository(PurchaseItemEntity).save(itemData)

  }
}
