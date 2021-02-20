import { LoadUserByUsernameRepository } from '@/data/protocols/db/user/LoadUserByUsernameRepository'
import { UserModel, UserStatus } from '@/domain/models/user/UserModel'
import { getRepository } from 'typeorm'
import { UserEntity } from '../entities/UserEntity'
import { UpdateAcessTokenRepository } from '@/data/protocols/db/user/UpdateAcessTokenRepository'
import { LoadUserByTokenRepository } from '@/data/protocols/db/user/LoadUserByTokenRepository'
import { LoadUsersRepository } from '@/data/protocols/db/user/LoadUsersRepository'
import { UserList } from '@/domain/models/user/UserList'
import { LoadAllUsersRepository } from '@/data/protocols/db/user/LoadAllUsersRepository'
import { InsertUserRepository } from '@/data/protocols/db/user/InsertUserRepository'
import { UpdateUserRepository } from '@/data/protocols/db/user/UpdateUserRepository'

export class UserTypeOrmRepository
  implements
  LoadUserByUsernameRepository,
  UpdateAcessTokenRepository,
  LoadUserByTokenRepository,
  LoadUsersRepository,
  LoadAllUsersRepository,
  InsertUserRepository,
  UpdateUserRepository {

  async insert(newUser: UserModel): Promise<UserModel> {
    const user = await getRepository(UserEntity).save(newUser)
    return user
  }

  async getUserByUsername(username: string): Promise<UserModel | null> {
    const repository = getRepository<UserModel>(UserEntity)
    const user = await repository.findOne({ where: { username, status: UserStatus.ACTIVE } })

    if (user) return user
    return null
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const repository = getRepository<UserModel>(UserEntity)

    await repository
      .createQueryBuilder()
      .update()
      .set({ accessToken })
      .where('id = :id', { id })
      .execute()
  }

  async loadByToken(accessToken: string): Promise<UserModel | null> {
    const repository = getRepository<UserModel>(UserEntity)
    const user = await repository.findOne({ where: { accessToken } })
    return user || null
  }

  async load(): Promise<UserList[]> {
    return await getRepository(UserEntity)
      .createQueryBuilder('users')
      .select('users.id')
      .addSelect('users.name')
      .orderBy('name', 'ASC')
      .where('status = :status', { status: UserStatus.ACTIVE })
      .getMany()
  }

  async getAllUsers(): Promise<UserModel[]> {
    const users = await getRepository(UserEntity).find()
    return users
  }

  async update(userData: UserModel): Promise<void> {
    await getRepository(UserEntity).save(userData)
  }
}
