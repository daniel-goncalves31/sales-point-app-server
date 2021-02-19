import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import {
  closeSqliteConnection,
  setupSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'

import { NewProductModel } from '@/domain/models/product/NewProductModel'
import { ProductStatus } from '@/domain/models/product/ProductModel'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import app from '../../config/app'
import { env } from '@/main/config/env'
import { getRepository } from 'typeorm'
import { hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import request from 'supertest'

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

describe('Add Product Route', () => {
  test('should return 403 on add product without access token', async () => {
    const res = await request(app)
      .post('/api/product')
      .send({
        name: 'invalid_product',
        brand: 'any_brand',
        quantity: 2,
        minQuantity: 1
      })

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 403 on add product with not allowed role', async () => {
    const res = await request(app)
      .post('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${employeeAccessToken}`)
      .send({})

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on add product with invalid credentials', async () => {
    let res = await request(app)
      .post('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({
        product: {
          name: 'invalid_product',
          brand: 'any_brand',
          quantity: 2,
          minQuantity: 1
        },
        purchasePrice: 2.99
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .post('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({
        product: {
          name: 'invalid_product',
          brand: 'any_brand',
          price: 1,
          quantity: 1,
          minQuantity: 2
        },
        purchasePrice: 2.99
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .post('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({
        product: {
          name: 'invalid_product',
          brand: 'any_brand',
          price: 1,
          quantity: 5,
          minQuantity: 2
        }
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 200 on add product with valid credentials', async () => {
    const fakeNewProduct: NewProductModel = {
      product: {
        name: 'any_name',
        brand: 'any_brand',
        price: 1,
        quantity: 2,
        minQuantity: 1,
        status: ProductStatus.ACTIVE
      },
      purchasePrice: 2.99
    }

    const res = await request(app)
      .post('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send(fakeNewProduct)

    const { product, purchase } = res.body
    expect(res.status).toBe(200)
    expect(product.id).toBeTruthy()
    expect(purchase.id).toBeTruthy()
    expect(purchase.items.length).toBe(1)
  })
})
