import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { hashSync } from 'bcrypt'
import { getRepository } from 'typeorm'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { ProductEntity } from '@/infra/db/typeorm/entities/ProductEntity'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'
import { NewPurchaseModel } from '@/domain/models/purchase/NewPurchaseModel'
import { PurchaseEntity } from '@/infra/db/typeorm/entities/PurchaseEntity'
import { PurchaseItemEntity } from '@/infra/db/typeorm/entities/PurchaseItemEntity'

const accessToken = jwt.sign({ id: 'any_id' }, env.JWT_SECRET)

const fakeUserId = 'b3d7e8d8-9a9f-46fa-9748-92b5cfef7301'

const fakeUser: UserModel = {
  id: fakeUserId,
  name: 'any_name',
  username: 'test_username',
  password: hashSync('123456', 12),
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  accessToken
}

const employeeAccessToken = jwt.sign({ id: 'other_id' }, env.JWT_SECRET)

const fakeEmployeeUser: UserModel = {
  id: 'other_id',
  name: 'any_name',
  username: 'test_username',
  password: hashSync('123456', 12),
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE,
  accessToken: employeeAccessToken
}

const fakeProduct = {
  brand: 'any_brand',
  name: 'any_product',
  price: 5.99,
  quantity: 5,
  minQuantity: 2
}

const fakeNewPurchase: NewPurchaseModel = {
  items: [
    {
      price: 4.99,
      productId: 1,
      quantity: 3
    },
    {
      price: 2.99,
      productId: 1,
      quantity: 1
    }
  ]
}

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeUser)
  await getRepository<ProductModel>(ProductEntity).save(fakeProduct)

  const purchase = await getRepository(PurchaseEntity).save({
    date: new Date('2020-07-27'),
    userId: fakeUserId
  })
  await getRepository(PurchaseItemEntity).save(
    fakeNewPurchase.items.map(item => ({ ...item, purchaseId: purchase.id }))
  )
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Load Purchases Route', () => {
  test('should return 403 on load purchases without access token', async () => {
    const res = await request(app).get('/api/purchase')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 403 on load purchases with not allowed role', async () => {
    await getRepository<UserModel>(UserEntity).save(fakeEmployeeUser)
    const res = await request(app)
      .get('/api/purchase')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${employeeAccessToken}`)

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on load purchases with invalid params', async () => {
    const res = await request(app)
      .get('/api/purchase?date=2020-01-01_2020-12-31&filter=')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 200 on load purchases with valid params', async () => {
    let res = await request(app)
      .get('/api/purchase')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThanOrEqual(1)

    res = await request(app)
      .get('/api/purchase?date=2020-01-01 - 2020-12-31&filter=any')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThanOrEqual(1)
  })
})
