import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import {
  closeSqliteConnection,
  setupSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'

import { NewSaleModel } from '@/domain/models/sale/NewSaleModel'
import { ProductEntity } from '@/infra/db/typeorm/entities/ProductEntity'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { SaleEntity } from '@/infra/db/typeorm/entities/SaleEntity'
import { SaleItemEntity } from '@/infra/db/typeorm/entities/SaleItemEntity'
import { SalePaymentType } from '@/domain/models/sale/SaleModel'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import app from '../../config/app'
import { env } from '@/main/config/env'
import { getRepository } from 'typeorm'
import { hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import request from 'supertest'

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

const fakeProduct = {
  brand: 'any_brand',
  name: 'any_product',
  price: 5.99,
  quantity: 5,
  minQuantity: 2
}

const fakeNewSale: NewSaleModel = {
  userId: fakeUserId,
  paymentType: SalePaymentType.MONEY,
  total: 299,
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

  const sale = await getRepository(SaleEntity).save({
    date: new Date(),
    userId: fakeUserId,
    total: 299
  })
  await getRepository(SaleItemEntity).save(
    fakeNewSale.items.map((item) => ({
      ...item,
      saleId: sale.id,
      purchasePrice: 2
    }))
  )
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Load Sales Route', () => {
  test('should return 403 on load sales without access token', async () => {
    const res = await request(app).get('/api/sale')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on load sales with invalid params', async () => {
    const res = await request(app)
      .get('/api/sale?date=2020-01-01_2020-12-31&filter=')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 200 on load sales with valid params', async () => {
    const res = await request(app)
      .get('/api/sale')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThanOrEqual(1)

    // res = await request(app)
    //   .get('/api/sale?date=2020-01-01 - 2020-12-31&filter=any')
    //   .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    // expect(res.status).toBe(200)
    // expect(res.body.length).toBeGreaterThanOrEqual(1)
  })
})
