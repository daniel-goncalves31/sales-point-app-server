import {
  setupSqliteConnection,
  closeSqliteConnection
} from '@/infra/db/typeorm/sqlite-helper'
import request from 'supertest'
import app from '../../config/app'
import { getRepository } from 'typeorm'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { compareSync, hashSync } from 'bcrypt'
import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'

const fakeUser: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'any_username',
  password: 'sdaedasdsa',
  role: UserRole.EMPLOYEE,
  status: UserStatus.ACTIVE,
}

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

describe('Update User Route', () => {
  test('should return 403 on update user without access token', async () => {
    const res = await request(app).put('/api/user')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 403 on update user with not allowed role', async () => {
    const res = await request(app)
      .put('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminAccessToken}`)

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on update user with invalid credentials', async () => {
    let res = await request(app)
      .put('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminMasterAccessToken}`)
      .send({ ...fakeUser, id: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .put('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminMasterAccessToken}`)
      .send({ ...fakeUser, username: undefined })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 204 on update user with valid credentials', async () => {

    fakeUser.name = 'another_name'
    fakeUser.password = 'another_password'

    const res = await request(app)
      .put('/api/user')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${adminMasterAccessToken}`)
      .send(fakeUser)

    const updatedUser = await getRepository(UserEntity).findOne({ id: fakeUser.id })

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
    expect(updatedUser?.name).toEqual(fakeUser.name)
    expect(compareSync(fakeUser.password, updatedUser!.password)).toEqual(true)
  })
})
