import { ProductModel, ProductStatus } from '@/domain/models/product/ProductModel'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import {
  closeSqliteConnection,
  setupSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'

import { ProductEntity } from '@/infra/db/typeorm/entities/ProductEntity'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import app from '../../config/app'
import { env } from '@/main/config/env'
import { getRepository } from 'typeorm'
import { hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import request from 'supertest'

const fakeProduct: ProductModel = {
  id: 1,
  name: 'invalid_product',
  brand: 'any_brand',
  price: 1,
  quantity: 2,
  minQuantity: 1,
  status: ProductStatus.ACTIVE
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

describe('Update Product Route', () => {
  test('should return 403 on update product without access token', async () => {
    const res = await request(app).put('/api/product')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 403 on update product with not allowed role', async () => {
    const res = await request(app)
      .put('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${employeeAccessToken}`)

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on update product with invalid credentials', async () => {
    let res = await request(app)
      .put('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({ ...fakeProduct, id: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .put('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({ ...fakeProduct, minQuantity: 5 })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .put('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({ ...fakeProduct, status: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 200 on update product with valid credentials', async () => {
    await getRepository<ProductModel>(ProductEntity)
      .createQueryBuilder()
      .update(fakeProduct)
      .execute()

    const res = await request(app)
      .put('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send({ ...fakeProduct })

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })
})
