import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ProductModel, ProductStatus } from '../../../../domain/models/product/ProductModel'

import { PurchaseItemEntity } from './PurchaseItemEntity'
import { PurchaseItemModel } from '@/domain/models/purchase/PurchaseItemModel'
import { SaleItemEntity } from './SaleItemEntity'
import { SaleItemModel } from '@/domain/models/sale/SaleItemModel'

@Entity({ name: 'products' })
export class ProductEntity implements ProductModel {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar' })
  brand!: string

  @Column({ type: 'decimal' })
  price!: number

  @Column({ type: 'int' })
  quantity!: number

  @Column({ type: 'int' })
  minQuantity!: number

  @OneToMany(
    () => SaleItemEntity,
    saleItem => saleItem.product,
    {onDelete: 'CASCADE', onUpdate: 'CASCADE', cascade: true}
  )
  saleItem!: SaleItemModel

  @OneToMany(
    () => PurchaseItemEntity,
    purchaseItem => purchaseItem.product,
    {onDelete: 'CASCADE', onUpdate: 'CASCADE', cascade: true}
  )
  purchaseItem!: PurchaseItemModel

  @Column({
    type: 'simple-enum',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE
  })
  status!: ProductStatus
}
