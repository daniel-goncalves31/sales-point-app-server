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
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'

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

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Load Products Route', () => {
  test('should return 403 on load products without access token', async () => {
    const res = await request(app).get('/api/product')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 200 on get products', async () => {
    const fakeProduct = {
      name: 'any_name',
      brand: 'any_brand',
      price: 1,
      quantity: 2,
      minQuantity: 1
    }

    const fakeArrProducts = [
      fakeProduct,
      fakeProduct,
      fakeProduct
    ]

    const repo = getRepository<ProductModel>(ProductEntity)
    await repo.save(fakeArrProducts)

    const res = await request(app)
      .get('/api/product')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3)
  })
})
