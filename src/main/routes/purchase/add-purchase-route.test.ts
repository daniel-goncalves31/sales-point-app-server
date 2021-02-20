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

const fakeProduct = {
  brand: 'any_brand',
  name: 'any_product',
  price: 5.99,
  quantity: 5,
  minQuantity: 2
}

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeAdminUser)
  await getRepository<UserModel>(UserEntity).save(fakeEmployeeUser)
  await getRepository<ProductModel>(ProductEntity).save(fakeProduct)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Add Purchase Route', () => {
  test('should return 403 on add purchase without access token', async () => {
    const res = await request(app)
      .post('/api/purchase')
      .send({})

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 403 on add purchase with not allowed role', async () => {
    const res = await request(app)
      .post('/api/purchase')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${employeeAccessToken}`)
      .send({})

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on add purchase with invalid credentials', async () => {
    let res = await request(app)
      .post('/api/purchase')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({
        items: [
          {
            price: 2.99,
            quantity: 1
          },
          {
            price: 2.99,
            productId: 1,
            quantity: 1
          }
        ]
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .post('/api/purchase')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({
        items: [
          {
            price: 2.99,
            productId: 1,
            quantity: 1
          },
          {
            price: 2.99,
            productId: 1
          }
        ]
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .post('/api/purchase')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({
        items: [
          {
            price: 2.99,
            productId: 1,
            quantity: 1
          },
          {
            productId: 1,
            quantity: 4
          }
        ]
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 500 on add purchase with inexitent product id', async () => {
    const res = await request(app)
      .post('/api/purchase')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({
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

  test('should return 200 on add purchase with valid values', async () => {
    const res = await request(app)
      .post('/api/purchase')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({
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
