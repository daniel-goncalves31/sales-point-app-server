import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { getRepository } from 'typeorm'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import { hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { ProductEntity } from '@/infra/db/typeorm/entities/ProductEntity'
import { SalePaymentType } from '@/domain/models/sale/SaleModel'

const accessToken = jwt.sign({ id: 'any_id' }, env.JWT_SECRET)

const fakeUser: UserModel = {
  id: 'any_id',
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

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeUser)
  await getRepository<ProductModel>(ProductEntity).save(fakeProduct)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Add Sale Route', () => {
  test('should return 403 on add sale without access token', async () => {
    const res = await request(app)
      .post('/api/sale')
      .send({})

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on add sale with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/sale')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({
        userId: 'any_id',
        total: 299,
        paymentType: SalePaymentType.MONEY,
        items: [
          {
            productId: 1,
            price: 2.99,
            quantity: 1
          },
          {
            productId: 1,
            quantity: 1
          }
        ]
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

  })

  test('should return 500 on add sale with inexitent product id', async () => {
    const res = await request(app)
      .post('/api/sale')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({
        userId: 'any_id',
        total: 299,
        paymentType: SalePaymentType.MONEY,
        items: [
          {
            price: 2.99,
            quantity: 1,
            productId: 1
          },
          {
            price: 2.99,
            productId: 'inexistent_id',
            quantity: 1
          }
        ]
      })

    expect(res.status).toBe(500)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 200 on add sale with valid values', async () => {
    const res = await request(app)
      .post('/api/sale')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({
        userId: 'any_id',
        total: 299,
        paymentType: SalePaymentType.MONEY,
        items: [
          {
            price: 4.99,
            quantity: 2,
            productId: 1
          },
          {
            price: 2.99,
            productId: 1,
            quantity: 1
          }
        ]
      })

    expect(res.status).toBe(200)
    expect(res.body.id).toBeTruthy()
    expect(res.body.user).toBeTruthy()
    expect(res.body.items.length).toBe(2)
  })
})
