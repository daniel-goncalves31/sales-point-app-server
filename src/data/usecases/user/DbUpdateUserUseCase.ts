import { UpdateUserUseCase } from '@/domain/usecases/user/UpdateUserUseCase'
import { Encrypter } from '@/data/protocols/cryptography/Encrypter'
import { UpdateUserRepository } from '@/data/protocols/db/user/UpdateUserRepository'
import { UserModel } from '@/domain/models/user/UserModel'

export class DbUpdateUserUseCase implements UpdateUserUseCase {
  constructor(
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly encrypter: Encrypter
  ) { }

  async update(user: UserModel): Promise<void> {
    if (user.password) {
      const hashedPassword = this.encrypter.encrypt(user.password)
      user.password = hashedPassword
    }
    await this.updateUserRepository.update(user)
  }
}
