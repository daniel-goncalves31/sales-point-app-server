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

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository<UserModel>(UserEntity).save(fakeUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('Delete Service Route', () => {
  test('should return 403 on delete service without access token', async () => {
    const res = await request(app).delete('/api/service')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 403 on delete service with invalid role', async () => {
    await getRepository<UserModel>(UserEntity).save(fakeEmployeeUser)
    const res = await request(app).delete('/api/service')

    expect(res.status).toBe(403)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 400 on delete service with invalid credentials', async () => {
    const res = await request(app)
      .delete('/api/service')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send({ id: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })
  test('should return 204 on delete service with valid credentials', async () => {
    const fakeService = {
      name: 'invalid_service',
      brand: 'any_brand'
    }

    await getRepository<ServiceModel>(ServiceEntity).save(fakeService)

    const res = await request(app)
      .delete('/api/service')
      .set('cookie', `d794$7dsa99_dsadsa978lbipe$sdspp=${accessToken}`)
      .send(fakeService)

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })
})
