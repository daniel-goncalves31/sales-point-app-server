import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne
} from 'typeorm'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'
import { UserEntity } from './UserEntity'
import { UserModel } from '@/domain/models/user/UserModel'
import { PurchaseItemEntity } from './PurchaseItemEntity'
import { PurchaseItemModel } from '@/domain/models/purchase/PurchaseItemModel'

@Entity({ name: 'purchases' })
export class PurchaseEntity implements PurchaseModel {
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  date!: Date

  @ManyToOne(
    () => UserEntity,
    user => user.purchases
  )
  user!: UserModel

  @Column({ type: 'varchar' })
  userId!: string

  @OneToMany(
    () => PurchaseItemEntity,
    item => item.purchase
  )
  items!: PurchaseItemModel[]
}
