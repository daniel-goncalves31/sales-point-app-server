import { UserList } from '@/domain/models/user/UserList'
import { LoadUsersRepository } from '@/data/protocols/db/user/LoadUsersRepository'
import { LoadUsersUseCase } from '@/domain/usecases/user/LoadUsersUseCase'

export class DbLoadUsersUseCase implements LoadUsersUseCase {
  constructor (private readonly loadUsersRepository: LoadUsersRepository) {}
  async load (): Promise<UserList[]> {
    return await this.loadUsersRepository.load()
  }
}
