import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { PurchaseItemModel } from '@/domain/models/purchase/PurchaseItemModel'
import { ProductEntity } from './ProductEntity'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'
import { PurchaseEntity } from './PurchaseEntity'

@Entity({ name: 'purchase_items' })
export class PurchaseItemEntity implements PurchaseItemModel {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'decimal' })
  price!: number

  @Column({ type: 'int' })
  quantity!: number

  @ManyToOne(
    () => ProductEntity,
    product => product.purchaseItem
  )
  product!: ProductModel

  @Column({ type: 'int' })
  productId!: number

  @ManyToOne(
    () => PurchaseEntity,
    purchase => purchase.items,
    { cascade: true }
  )
  purchase!: PurchaseModel

  @Column({ type: 'int' })
  purchaseId!: number
}
