import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne
} from 'typeorm'
import { SaleModel, SalePaymentType } from '../../../../domain/models/sale/SaleModel'
import { UserEntity } from './UserEntity'
import { UserModel } from '@/domain/models/user/UserModel'
import { SaleItemEntity } from './SaleItemEntity'
import { SaleItemModel } from '@/domain/models/sale/SaleItemModel'

@Entity({ name: 'sales' })
export class SaleEntity implements SaleModel {
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  date!: Date

  @Column({type: 'simple-enum', enum: SalePaymentType, default: SalePaymentType.MONEY})
  paymentType!: SalePaymentType

  @ManyToOne(
    () => UserEntity,
    user => user.sales
  )
  user!: UserModel

  @Column({ type: 'varchar' })
  userId!: string

  @Column({type: 'decimal'})
  total!: number

  @OneToMany(
    () => SaleItemEntity,
    item => item.sale
  )
  items!: SaleItemModel[]
}
