import request from 'supertest'
import app from '../../config/app'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { hashSync } from 'bcrypt'
import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import { getRepository } from 'typeorm'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'
import { UpdateSaleModel } from '@/domain/models/sale/UpdateSaleModel'
import { SaleModel } from '@/domain/models/sale/SaleModel'
import { SaleEntity } from '@/infra/db/typeorm/entities/SaleEntity'

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

const fakeSale: UpdateSaleModel = {
  id: 1,
  userId: 'any_id',
  date: new Date()
}

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeUser)
  await getRepository<UserModel>(UserEntity).save(fakeEmployeeUser)
  await getRepository<SaleModel>(SaleEntity).save({id: 1, userId: 'any_id', date: new Date(), total: 299})
})

afterAll(async () => {
  await closeSqliteConnection()
})
describe('Update Sale Route', () => {
  test('should return 403 on update sale without access token', async () => {
    const res = await request(app)
      .put('/api/sale')
      .send({})

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 403 on update sale with not allowed role', async () => {
    const res = await request(app)
      .put('/api/sale')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${employeeAccessToken}`)
      .send({})

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on update sale with invalid credentials', async () => {
    let res = await request(app)
      .put('/api/sale')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({ ...fakeSale, id: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .put('/api/sale')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({ ...fakeSale, userId: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 204 on update sale with valid credentials', async () => {
    const res = await request(app)
      .put('/api/sale')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send(fakeSale)

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })
})
