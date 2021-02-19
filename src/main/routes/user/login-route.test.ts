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

const fakeUser: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'test_username',
  password: hashSync('123456', 12),
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE
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

describe('Login Route', () => {
  test('should return 400 on login with invalid credentials', async () => {
    let res = await request(app)
      .post('/api/login')
      .send({
        password: '123456'
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()

    res = await request(app)
      .post('/api/login')
      .send({
        username: 'any_username'
      })

    expect(res.status).toBe(400)
    expect(res.body.error).toBeTruthy()
  })

  test('should return 204 on login with inexistent username', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'inexistent_username',
        password: '123456'
      })

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })

  test('should return 200 on login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'test_username',
        password: '123456'
      })

    const expectedUser = fakeUser
    delete fakeUser.password
    delete fakeUser.accessToken

    expect(res.header['set-cookie'][0]).toContain(
      'd794$7dsa99_dsadsa978lbipe$sdspp'
    )

    expect(res.status).toBe(200)
    expect(res.body).toEqual(expectedUser)
  })
})
