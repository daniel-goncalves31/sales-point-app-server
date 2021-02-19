import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ProductEntity } from './ProductEntity'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { SaleEntity } from './SaleEntity'
import { SaleItemModel } from '@/domain/models/sale/SaleItemModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'
import { ServiceEntity } from './ServiceEntity'
import { ServiceModel } from '@/domain/models/service/ServiceModel'

@Entity({ name: 'sale_items' })
export class SaleItemEntity implements SaleItemModel {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'decimal' })
  price!: number

  @Column({ type: 'decimal', nullable: true })
  purchasePrice!: number

  @Column({ type: 'int' })
  quantity!: number

  @ManyToOne(
    () => ProductEntity,
    product => product.saleItem
  )
  product!: ProductModel

  @Column({ type: 'int', nullable: true })
  productId!: number

  @ManyToOne(
    () => ServiceEntity,
    service => service.saleItem
  )
  service!: ServiceModel

  @Column({ type: 'int', nullable: true })
  serviceId!: number

  @ManyToOne(
    () => SaleEntity,
    sale => sale.items,
    { cascade: true }
  )
  sale!: SaleModel

  @Column({ type: 'int' })
  saleId!: number
}
