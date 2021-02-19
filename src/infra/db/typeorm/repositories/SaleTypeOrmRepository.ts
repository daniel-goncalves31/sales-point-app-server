import { Brackets, In, getRepository } from 'typeorm'

import { DeleteSaleItemRepository } from '@/data/protocols/db/sale/DeleteSaleItemRepository'
import { DeleteSaleRepository } from '@/data/protocols/db/sale/DeleteSaleRepository'
import { InsertSaleRepository } from '@/data/protocols/db/sale/InsertSaleRepository'
import { LoadSaleParamsModel } from '@/domain/models/sale/LoadSaleParamsModel'
import { LoadSalesRepository } from '@/data/protocols/db/sale/LoadSalesRepository'
import { NewSaleModel } from '@/domain/models/sale/NewSaleModel'
import { ProductEntity } from '../entities/ProductEntity'
import { PurchaseItemEntity } from '../entities/PurchaseItemEntity'
import { SaleEntity } from '../entities/SaleEntity'
import { SaleItemEntity } from '../entities/SaleItemEntity'
import { SaleItemModel } from '@/domain/models/sale/SaleItemModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'
import { UpdateSaleModel } from '@/domain/models/sale/UpdateSaleModel'
import { UpdateSaleRepository } from '@/data/protocols/db/sale/UpdateSaleRepository'

export class SaleTypeOrmRepository
  implements
  InsertSaleRepository,
  LoadSalesRepository,
  DeleteSaleRepository,
  UpdateSaleRepository,
  DeleteSaleItemRepository {
  async insert(newSaleData: NewSaleModel): Promise<SaleModel> {
    const saleRep = getRepository(SaleEntity)
    const sale = await saleRep.save({
      userId: newSaleData.userId,
      date: new Date().toISOString(),
      total: newSaleData.total,
      paymentType: newSaleData.paymentType
    })

    const itemRepo = getRepository<SaleItemModel>(SaleItemEntity)
    const items: SaleItemModel[] = []
    for (let i = 0; i < newSaleData.items.length; i++) {
      const newSaleItem = newSaleData.items[i]
      let purchasePrice = 0

      if (newSaleItem.purchasePrice || newSaleItem.purchasePrice === 0) {
        purchasePrice = newSaleItem.purchasePrice
      } else {
        const purchaseItem = await getRepository(PurchaseItemEntity)
          .createQueryBuilder('purchase_items')
          .select('purchase_items.price')
          .where('purchase_items.productId = :productId', {
            productId: newSaleItem.productId
          })
          .orderBy('id', 'DESC')
          .getOne()

        purchasePrice = purchaseItem?.price || 0
      }

      const item = await itemRepo.save({
        ...newSaleItem,
        saleId: sale.id,
        purchasePrice
      })
      items.push(item)
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i].productId) {
        const product = await getRepository(ProductEntity).findOne({
          id: items[i].productId
        })

        const newQuantity = product!.quantity - items[i].quantity
        product!.quantity = newQuantity
        await getRepository(ProductEntity).save(product!)
        await getRepository(ProductEntity).findOne({
          id: items[i].productId
        })
      }
    }

    const addedSale = await saleRep
      .createQueryBuilder('sales')
      .addSelect('users.name')
      .addSelect('sale_items.id')
      .addSelect('sale_items.price')
      .addSelect('sale_items.quantity')
      .addSelect('products.id')
      .addSelect('products.name')
      .addSelect('products.brand')
      .addSelect('services.id')
      .addSelect('services.name')
      .addSelect('services.brand')
      .leftJoin('sales.user', 'users')
      .leftJoin('sales.items', 'sale_items')
      .leftJoin('sale_items.product', 'products')
      .leftJoin('sale_items.service', 'services')
      .where({ id: sale.id })
      .getOne()

    return addedSale!
  }

  async getSales(salesParams: LoadSaleParamsModel): Promise<SaleModel[]> {
    const query = getRepository(SaleEntity)
      .createQueryBuilder('sales')
      .select('sales.id')
      .leftJoin('sales.user', 'users')
      .leftJoin('sales.items', 'sale_items')
      .leftJoin('sale_items.product', 'products')
      .leftJoin('sale_items.service', 'services')

    if (salesParams.date && salesParams.filter) {
      const startDate = salesParams.date.split(' - ')[0]

      const endDate = new Date(salesParams.date.split(' - ')[1])
      endDate.setDate(endDate.getDate() + 1)

      query
      query
        .where('sales.date BETWEEN :startDate AND :endDate', {
          startDate,
          endDate: endDate.toISOString()
        })
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere(
              'LOWER(products.name) LIKE :filter OR LOWER(products.brand) LIKE :filter OR LOWER(services.name) LIKE :filter OR LOWER(services.brand) LIKE :filter',
              {
                filter: `${salesParams.filter?.toLowerCase()}%`
              }
            )
          })
        )
    } else if (salesParams.date) {
      const startDate = salesParams.date.split(' - ')[0]

      const endDate = new Date(salesParams.date.split(' - ')[1])
      endDate.setDate(endDate.getDate() + 1)

      query.where('sales.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate: endDate.toISOString()
      })
    } else if (salesParams.filter) {
      query.where(
        'LOWER(products.name) LIKE :filter OR LOWER(products.brand) LIKE :filter OR LOWER(services.name) LIKE :filter OR LOWER(services.brand) LIKE :filter',
        {
          filter: `${salesParams.filter.toLowerCase()}%`
        }
      )
    }

    const salesIds = await query.getMany()
    const ids = salesIds.map(sale => sale.id)

    const sales = await getRepository(SaleEntity)
      .createQueryBuilder('sales')
      .addSelect('users.name')
      .addSelect('sale_items.id')
      .addSelect('sale_items.price')
      .addSelect('sale_items.quantity')
      .addSelect('products.id')
      .addSelect('products.name')
      .addSelect('products.brand')
      .addSelect('services.id')
      .addSelect('services.name')
      .addSelect('services.brand')
      .leftJoin('sales.user', 'users')
      .leftJoin('sales.items', 'sale_items')
      .leftJoin('sale_items.product', 'products')
      .leftJoin('sale_items.service', 'services')
      .where({ id: In(ids) })
      .orderBy('sales.date', 'DESC')
      .limit(30)
      .getMany()

    return sales
  }

  async remove(saleId: number): Promise<void> {
    const items = await getRepository(SaleItemEntity)
      .createQueryBuilder('sale_items')
      .select('sale_items.quantity')
      .addSelect('sale_items.serviceId')
      .addSelect('products.id')
      .addSelect('products.quantity')
      .leftJoin('sale_items.product', 'products')
      .where('"saleId" = :id', { id: saleId })
      .getMany()

    for (let i = 0; i < items.length; i++) {
      if (!items[i].serviceId) {

        const product = items[i].product

        const newQuantity = product.quantity + items[i].quantity
        product.quantity = newQuantity

        await getRepository(ProductEntity).save(product)
      }
    }

    await getRepository(SaleItemEntity)
      .createQueryBuilder()
      .delete()
      .where('saleId = :id', { id: saleId })
      .execute()

    await getRepository(SaleEntity)
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: saleId })
      .execute()
  }

  async update(saleData: UpdateSaleModel): Promise<void> {
    await getRepository(SaleEntity).save(saleData)
  }

  async removeItem(saleItemId: number): Promise<void> {

    const saleItem = await getRepository(SaleItemEntity).findOne({ where: { id: saleItemId } })

    if (saleItem) {

      const sale = await getRepository(SaleEntity).findOne({ where: { id: saleItem.saleId }, relations: ['items'] })

      if (sale) {

        let numItems = 1
        const realTotal = sale.items.reduce((acc, item) => {
          if (item.price && item.quantity) {
            acc += item.price * item.quantity
            numItems++
          }
          return acc
        }, 0)

        sale.total -= saleItem.price * saleItem.quantity - (realTotal - sale.total) / numItems
        await getRepository(SaleEntity).save(sale)

        await getRepository(SaleItemEntity).delete(saleItem)
      }
    }


  }
}
