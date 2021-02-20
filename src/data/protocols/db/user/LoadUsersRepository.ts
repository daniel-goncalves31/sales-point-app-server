import { UserList } from '@/domain/models/user/UserList'

export interface LoadUsersRepository {
  load(): Promise<UserList[]>
}
