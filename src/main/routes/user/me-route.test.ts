import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import { Repository, getRepository } from 'typeorm'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import { hashSync } from 'bcrypt'
import request from 'supertest'
import app from '../../config/app'
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

let repository: Repository<UserModel> | null = null

beforeAll(async () => {
  await setupSqliteConnection()
  repository = getRepository<UserModel>(UserEntity)
  await repository.save(fakeUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Me Route', () => {
  test('should return 403 if no access token is provided', async () => {
    const res = await request(app).get('/api/me')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 403 if an invalid access token is provided', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('cookie', 'd794$7dsa99_dsadsa978lbipe$sdspp=""')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 200 if an valid access token is provided', async () => {
    const res = await request(app)
      .get('/api/me')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)

    expect(res.status).toBe(200)
    delete fakeUser.password
    delete fakeUser.accessToken
    expect(res.body).toEqual(fakeUser)
  })
})
