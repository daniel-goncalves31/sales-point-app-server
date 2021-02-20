import { LoadAllUsersUseCase } from '@/domain/usecases/user/LoadAllUsersUseCase'
import { LoadAllUsersRepository } from '@/data/protocols/db/user/LoadAllUsersRepository'
import { UserModel } from '@/domain/models/user/UserModel'

export class DbLoadAllUsersUseCase implements LoadAllUsersUseCase {
  constructor(
    private readonly loadAllUsersRepository: LoadAllUsersRepository
  ) { }

  async load(): Promise<UserModel[]> {
    return await this.loadAllUsersRepository.getAllUsers()
  }
}
