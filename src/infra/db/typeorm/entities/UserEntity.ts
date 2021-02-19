import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SaleEntity } from './SaleEntity'
import { SaleModel } from '@/domain/models/sale/SaleModel'
import { PurchaseModel } from '@/domain/models/purchase/PurchaseModel'
import { PurchaseEntity } from './PurchaseEntity'
import { UserModel, UserRole, UserStatus } from '../../../../domain/models/user/UserModel'

@Entity({ name: 'users' })
export class UserEntity implements UserModel {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id'
  })
  id!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar' })
  username!: string

  @Column({ type: 'varchar' })
  password!: string

  @Column({ type: 'simple-enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role!: UserRole

  @Column({ type: 'simple-enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus

  @Column({ type: 'varchar', nullable: true })
  accessToken!: string

  @OneToMany(
    () => SaleEntity,
    sale => sale.user
  )
  sales!: SaleModel[]

  @OneToMany(
    () => PurchaseEntity,
    purchase => purchase.user
  )
  purchases!: PurchaseModel[]
}
