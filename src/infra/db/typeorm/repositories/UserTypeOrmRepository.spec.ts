import { UserTypeOrmRepository } from './UserTypeOrmRepository'
import { setupSqliteConnection, closeSqliteConnection } from '../sqlite-helper'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { getRepository, Repository } from 'typeorm'
import { UserEntity } from '../entities/UserEntity'

const fakeAccessToken = 'any_value'

const fakeUser: UserModel = {
  id: 'any_id',
  name: 'any_name',
  username: 'any_username',
  password: 'hashed_password',
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE
}

interface SutType {
  sut: UserTypeOrmRepository
}

const makeSut = (): SutType => {
  const sut = new UserTypeOrmRepository()

  return {
    sut
  }
}

let repository: Repository<UserModel> | null = null

beforeAll(async () => {
  await setupSqliteConnection()
  repository = getRepository<UserModel>(UserEntity)
  await repository?.save(fakeUser)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('UserTypeOrmRepository', () => {
  describe('Get User by username', () => {
    test('should return an UserModel if the username is find', async () => {
      const { sut } = makeSut()

      const user = await sut.getUserByUsername(fakeUser.username)

      expect(user).toEqual(fakeUser)
    })
    test('should return null if the username is not find', async () => {
      const { sut } = makeSut()

      const user = await sut.getUserByUsername('inexistent_username')

      expect(user).toBeNull()
    })
  })
  describe('Update Access Token', () => {
    test('should update the access token on success', async () => {
      const { sut } = makeSut()

      const id = fakeUser.id

      let user = await repository?.findOne({ where: { id } })
      expect(user?.accessToken).toBeFalsy()

      await sut.updateAccessToken(id, fakeAccessToken)

      user = await repository?.findOne({ where: { id } })
      expect(user?.accessToken).toBe(fakeAccessToken)
    })
  })
  describe('Gett User By Token', () => {
    test('should return null if the token is not found', async () => {
      const { sut } = makeSut()

      let user = await sut.loadByToken('inexistent_token')
      expect(user).toBeNull()

      user = await sut.loadByToken('inexistent_token')
      expect(user).toBeNull()
    })
    test('should return an UserModel on success', async () => {
      const { sut } = makeSut()

      fakeUser.accessToken = fakeAccessToken
      await repository?.save(fakeUser)

      let user = await sut.loadByToken(fakeAccessToken)
      expect(user).toEqual(fakeUser)

      user = await sut.loadByToken(fakeAccessToken)
      expect(user).toEqual(fakeUser)
    })
  })
  describe('load()', () => {
    test('should return a UserList array on success', async () => {
      const { sut } = makeSut()

      const users = await sut.load()

      expect(users.length).toBe(1)
      expect(users[0].id).toBe(fakeUser.id)
      expect(users[0].name).toBe(fakeUser.name)
      expect((users[0] as any).password).toBeUndefined()
    })
  })
  describe('getAllAllUsers()', () => {
    test('should return all products', async () => {
      const { sut } = makeSut()

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

      const users = await sut.getAllUsers()

      expect(users).toHaveLength(4)
    })
  })
  describe('insert()', () => {
    test('should add the user and return it', async () => {
      const { sut } = makeSut()

      const fakeNewUser: UserModel = {
        id: 'any_id',
        name: 'any_name',
        username: 'any_username',
        password: 'sdaedasdsa',
        role: UserRole.EMPLOYEE,
        status: UserStatus.ACTIVE,
      }

      const res = await sut.insert(fakeNewUser)
      expect(res.id).toBeTruthy()
    })
  })
  describe('update()', () => {
    test('should update the user with the given id', async () => {
      const { sut } = makeSut()



      const repo = getRepository<UserModel>(UserEntity)

      fakeUser.name = 'another_name'
      fakeUser.password = 'another_pass'

      const res = await sut.update(fakeUser)

      const updatedUser = await repo.findOne({ where: { id: fakeUser.id } })

      expect(res).toBeUndefined()
      expect(updatedUser?.name).toEqual(fakeUser.name)
      expect(updatedUser?.password).toEqual(fakeUser.password)
    })
  })
})
