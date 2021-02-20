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

const accessToken = jwt.sign({ id: 'any_id' }, env.JWT_SECRET)
const fakeUser: UserModel = {
  id: 'b3d7e8d8-9a9f-46fa-9748-92b5cfef7301',
  name: 'any_name',
  username: 'test_username',
  password: hashSync('123456', 12),
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  accessToken
}

beforeAll(async () => {
  await setupSqliteConnection()
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Load Users Route', () => {
  test('should return 403 on load users without access token', async () => {
    const res = await request(app).get('/api/user')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy
  })
  test('should return 200 on load users with allowed rolw', async () => {
    await getRepository<UserModel>(UserEntity).save(fakeUser)
    const res = await request(app)
      .get('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThanOrEqual(1)
  })
})
