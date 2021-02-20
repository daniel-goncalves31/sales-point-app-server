import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { getRepository } from 'typeorm'
import { ServiceEntity } from '@/infra/db/typeorm/entities/ServiceEntity'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { hashSync } from 'bcrypt'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'

const fakeService: ServiceModel = {
  id: 1,
  name: 'invalid_service',
  brand: 'any_brand',
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

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Update Service Route', () => {
  test('should return 403 on update service without access token', async () => {
    const res = await request(app).put('/api/service')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on update service with invalid credentials', async () => {
    let res = await request(app)
      .put('/api/service')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({ ...fakeService, id: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .put('/api/service')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({ ...fakeService, name: '' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 200 on update service with valid credentials', async () => {
    await getRepository<ServiceModel>(ServiceEntity)
      .createQueryBuilder()
      .update(fakeService)
      .execute()

    const res = await request(app)
      .put('/api/service')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({ ...fakeService })

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })
})
