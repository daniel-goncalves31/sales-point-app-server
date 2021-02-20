import { UserList } from '@/domain/models/user/UserList'

export interface LoadUsersUseCase {
  load(): Promise<UserList[]>
}
