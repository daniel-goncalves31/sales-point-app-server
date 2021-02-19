import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { NewUserModel } from '@/domain/models/user/NewUserModel'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'
import { getRepository } from 'typeorm'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import { hashSync } from 'bcrypt'

const adminAccessToken = jwt.sign({ id: 'any_id' }, env.JWT_SECRET)
const adminMasterAccessToken = jwt.sign({ id: 'other_id' }, env.JWT_SECRET)

const fakeAdminUser: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'test_username',
  password: hashSync('123456', 12),
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  accessToken: adminAccessToken
}

const fakeAdminMasterUser: UserModel = {
  id: 'other_id',
  name: 'any_name',
  username: 'test_username',
  password: hashSync('123456', 12),
  role: UserRole.ADMIN_MASTER,
  status: UserStatus.ACTIVE,
  accessToken: adminMasterAccessToken
}

const fakeNewUser: NewUserModel = {
  name: 'any_name',
  username: 'any_username',
  password: 'any_password',
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE,
}

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeAdminUser)
  await getRepository<UserModel>(UserEntity).save(fakeAdminMasterUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Add User Route', () => {
  test('should return 403 on add user without access token', async () => {
    const res = await request(app)
      .post('/api/user')
      .send(fakeNewUser)

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 403 on add user with not allowed role', async () => {
    const res = await request(app)
      .post('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)
      .send(fakeNewUser)

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on add user with invalid credentials', async () => {
    let res = await request(app)
      .post('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminMasterAccessToken}`)
      .send({ ...fakeNewUser, username: undefined })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .post('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminMasterAccessToken}`)
      .send({ ...fakeNewUser, name: undefined })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .post('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminMasterAccessToken}`)
      .send({ ...fakeNewUser, password: undefined })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 200 on add user with valid credentials', async () => {

    const res = await request(app)
      .post('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminMasterAccessToken}`)
      .send(fakeNewUser)

    const user = res.body
    expect(res.status).toBe(200)
    expect(user.id).toBeTruthy()
  })
})
