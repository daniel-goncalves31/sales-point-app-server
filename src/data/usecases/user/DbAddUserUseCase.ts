import { AddUserUseCase } from '@/domain/usecases/user/AddUserUseCase'
import { NewUserModel } from '@/domain/models/user/NewUserModel'
import { UserModel } from '@/domain/models/user/UserModel'
import { InsertUserRepository } from '@/data/protocols/db/user/InsertUserRepository'
import { Encrypter } from '@/data/protocols/cryptography/Encrypter'
import { UUIDGenerator } from '@/data/protocols/generators/UUIDGenerator'

export class DbAddUserUseCase implements AddUserUseCase {
  constructor(
    private readonly inserUserRepository: InsertUserRepository,
    private readonly encrypter: Encrypter,
    private readonly uuidGenerator: UUIDGenerator
  ) { }

  async add(newUser: NewUserModel): Promise<UserModel> {
    const hashPassword = this.encrypter.encrypt(newUser.password)
    const uuid = this.uuidGenerator.generate()
    newUser.password = hashPassword
    return this.inserUserRepository.insert({ ...newUser, id: uuid })
  }
}
