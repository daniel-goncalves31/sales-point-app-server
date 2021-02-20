import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { getRepository } from 'typeorm'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { hashSync } from 'bcrypt'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'
import { UpdatePurchaseItemModel } from '@/domain/models/purchase/UpdatePurchaseItemModel'
import { PurchaseItemModel } from '@/domain/models/purchase/PurchaseItemModel'
import { ProductEntity } from '@/infra/db/typeorm/entities/ProductEntity'
import { PurchaseEntity } from '@/infra/db/typeorm/entities/PurchaseEntity'
import { PurchaseItemEntity } from '@/infra/db/typeorm/entities/PurchaseItemEntity'

const fakePurchaseItem: UpdatePurchaseItemModel = {
  id: 1,
  productId: 1,
  price: 1,
  quantity: 2,
}

const employeeAccessToken = jwt.sign({ id: 'any_id' }, env.JWT_SECRET)
const adminAccessToken = jwt.sign({ id: 'other_id' }, env.JWT_SECRET)

const fakeEmployeeUser: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'test_username',
  password: hashSync('123456', 12),
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE,
  accessToken: employeeAccessToken
}

const fakeAdminUser: UserModel = {
  id: 'other_id',
  name: 'any_name',
  username: 'test_username',
  password: hashSync('123456', 12),
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  accessToken: adminAccessToken
}

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeAdminUser)
  await getRepository<UserModel>(UserEntity).save(fakeEmployeeUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Update PurchaseItem Route', () => {
  test('should return 403 on update purchaseitem without access token', async () => {
    const res = await request(app).put('/api/purchase-item')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 403 on update purchaseitem with not allowed role', async () => {
    const res = await request(app)
      .put('/api/purchase-item')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${employeeAccessToken}`)

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on update purchaseitem with invalid credentials', async () => {
    let res = await request(app)
      .put('/api/purchase-item')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({ ...fakePurchaseItem, id: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .put('/api/purchase-item')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({ ...fakePurchaseItem, quantity: undefined })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 204 on update purchaseitem with valid credentials', async () => {

    const purchase = await getRepository(PurchaseEntity).save({ date: new Date().toISOString(), userId: fakeAdminUser.id })

    const oldProduct = await getRepository(ProductEntity).save({ name: 'any_product', brand: 'any_name', quantity: 5, minQuantity: 4, price: 2 })
    await getRepository(ProductEntity).save({ name: 'any_product', brand: 'any_name', quantity: 5, minQuantity: 4, price: 2 })
    const purchaseItem = await getRepository(PurchaseItemEntity).save({ price: 2, quantity: 4, productId: oldProduct.id, purchaseId: purchase.id })

    await getRepository<PurchaseItemModel>(PurchaseItemEntity)
      .createQueryBuilder()
      .update(fakePurchaseItem)
      .execute()

    const res = await request(app)
      .put('/api/purchase-item')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({ ...fakePurchaseItem, productId: oldProduct.id, id: (purchaseItem as any).id })

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })
})
