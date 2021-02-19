import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { getRepository } from 'typeorm'
import { ProductModel } from '@/domain/models/product/ProductModel'
import { ProductEntity } from '@/infra/db/typeorm/entities/ProductEntity'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { hashSync } from 'bcrypt'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'

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

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Delete Product Route', () => {
  test('should return 403 on delete product without access token', async () => {
    const res = await request(app).delete('/api/product')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 403 on delete product with invalid role', async () => {
    await getRepository<UserModel>(UserEntity).save(fakeEmployeeUser)
    const res = await request(app).delete('/api/product')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on delete product with invalid credentials', async () => {
    const res = await request(app)
      .delete('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({ id: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 200 on delete product with valid credentials', async () => {
    const fakeProduct = {
      name: 'invalid_product',
      brand: 'any_brand',
      price: 1,
      quantity: 2,
      minQuantity: 1
    }

    await getRepository<ProductModel>(ProductEntity).save(fakeProduct)

    const res = await request(app)
      .delete('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send(fakeProduct)

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })
})
