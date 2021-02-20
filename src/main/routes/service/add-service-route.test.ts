import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { NewServiceModel } from '@/domain/models/service/NewServiceModel'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'
import { getRepository } from 'typeorm'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import { hashSync } from 'bcrypt'

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

describe('Add Service Route', () => {
  test('should return 403 on add service without access token', async () => {
    const res = await request(app)
      .post('/api/service')
      .send({
        name: 'invalid_service',
        brand: 'any_brand',
        quantity: 2,
        minQuantity: 1
      })

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on add service with invalid credentials', async () => {
    let res = await request(app)
      .post('/api/service')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({
        name: 'invalid_service',
        brand: '',
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .post('/api/service')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({
        name: '',
        brand: 'any_brand',

      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

  })

  test('should return 200 on add service with valid credentials', async () => {
    const fakeNewService: NewServiceModel = {
      name: 'any_name',
      brand: 'any_brand',
    }

    const res = await request(app)
      .post('/api/service')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send(fakeNewService)

    expect(res.status).toBe(200)
    expect(res.body.id).toBeTruthy()
    expect(res.body.brand).toEqual('any_brand')
    expect(res.body.name).toEqual('any_name')
  })
})
