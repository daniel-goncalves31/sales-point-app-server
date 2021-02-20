import request from 'supertest'
import app from '../../config/app'
import { getRepository } from 'typeorm'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import { ProductEntity } from '@/infra/db/typeorm/entities/ProductEntity'
import { SaleEntity } from '@/infra/db/typeorm/entities/SaleEntity'
import { SaleItemEntity } from '@/infra/db/typeorm/entities/SaleItemEntity'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import { hashSync } from 'bcrypt'
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

const fakeNewProduct = {
  name: 'any_name',
  brand: 'any_brand',
  price: 1,
  quantity: 5,
  minQuantity: 1
}

beforeAll(async () => {
  await setupSqliteConnection()
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Delete Sale Route', () => {
  test('should return 403 on delete sale without access token', async () => {
    const res = await request(app)
      .delete('/api/sale')
      .send({})

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 403 on delete sale with invalid role', async () => {
    await getRepository<UserModel>(UserEntity).save(fakeEmployeeUser)
    const res = await request(app)
      .delete('/api/sale')
      .send({})

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 204 on delete sale successfully', async () => {
    const user = await getRepository(UserEntity).save(fakeUser as any)
    const product = await getRepository(ProductEntity).save(fakeNewProduct)
    const sale = await getRepository(SaleEntity).save({
      total: 299,
      userId: user.id,
      date: new Date()
    })

    const item = await getRepository(SaleItemEntity).save({
      price: 2,
      quantity: 2,
      productId: product.id,
      purchasePrice: 2,
      saleId: sale.id
    })

    const res = await request(app)
      .delete('/api/sale')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({ saleId: 1 })

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})

    const deletedSale = await getRepository(SaleEntity).findOne({
      where: { id: sale.id }
    })
    const deletedItem = await getRepository(SaleItemEntity).findOne({
      where: { id: item.id }
    })

    expect(deletedSale).toBeFalsy()
    expect(deletedItem).toBeFalsy()
  })
})
