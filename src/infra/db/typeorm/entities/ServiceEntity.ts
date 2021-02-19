import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { SaleItemModel } from '@/domain/models/sale/SaleItemModel'
import { SaleItemEntity } from './SaleItemEntity'

@Entity({ name: 'services' })
export class ServiceEntity implements ServiceModel {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar' })
  brand!: string

  @OneToMany(
    () => SaleItemEntity,
    saleItem => saleItem.product,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE', cascade: true }
  )
  saleItem!: SaleItemModel
}
