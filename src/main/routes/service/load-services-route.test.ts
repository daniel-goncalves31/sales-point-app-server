import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { getRepository } from 'typeorm'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { ServiceEntity } from '@/infra/db/typeorm/entities/ServiceEntity'
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

describe('Load Services Route', () => {
  test('should return 403 on load services without access token', async () => {
    const res = await request(app).get('/api/service')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 200 on get services', async () => {
    const fakeService = {
      name: 'any_name',
      brand: 'any_brand',
    }

    const fakeArrServices = [
      fakeService,
      fakeService,
      fakeService
    ]

    const repo = getRepository<ServiceModel>(ServiceEntity)
    await repo.save(fakeArrServices)

    const res = await request(app)
      .get('/api/service')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3)
    expect(res.body[0].name).toEqual('any_name')
  })
})
