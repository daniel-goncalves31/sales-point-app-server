import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { getRepository } from 'typeorm'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'

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

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeAdminUser)
  await getRepository<UserModel>(UserEntity).save(fakeAdminMasterUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Load All Users Route', () => {
  test('should return 403 on load users without access token', async () => {
    const res = await request(app).get('/api/users')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 403 on load all users with not allowed role', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${fakeAdminUser}`)
      .send({})

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 200 on get users', async () => {

    const fakeNewUser = {
      name: 'any_name',
      username: 'any_username',
      password: 'any_password',
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
    }

    const fakeUsersArr: any[] = [
      fakeNewUser,
      fakeNewUser,
      fakeNewUser
    ]

    const repo = getRepository<UserModel>(UserEntity)
    await repo.save(fakeUsersArr)


    const res = await request(app)
      .get('/api/users')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminMasterAccessToken}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(5)
  })
})
