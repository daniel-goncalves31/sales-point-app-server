import { UserRole, UserStatus } from '@/domain/models/user/UserModel'

import { UserEntity } from '@/infra/db/typeorm/entities/UserEntity'
import { getRepository } from 'typeorm'
import { hashSync } from 'bcrypt'

export const seedUsers = async () => {

  const users = await getRepository(UserEntity).find()

  if (!users.length) {

    await getRepository(UserEntity).save({
      name: 'Administrador',
      password: hashSync('admin', 12),
      username: 'admin',
      role: UserRole.ADMIN_MASTER,
      status: UserStatus.ACTIVE
    })

    await getRepository(UserEntity).save({
      name: 'Colaborador',
      password: hashSync('user', 12),
      username: 'user',
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE
    })
  }
}