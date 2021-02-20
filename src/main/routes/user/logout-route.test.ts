import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { hashSync } from 'bcrypt'
import { getRepository } from 'typeorm'
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

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Log Out Route', () => {
  test('should return 403 on logout without access token', async () => {
    const res = await request(app).get('/api/logout')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 204 on logout with access token', async () => {
    const res = await request(app)
      .get('/api/logout')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })
  test('should return 403 on access a protected route with the same access token after logout', async () => {
    const res = await request(app)
      .get('/api/logout')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })
})
