import { UserModel } from '@/domain/models/user/UserModel'

export interface HttpRequest<T = any, P = any> {
  body?: T
  headers?: any
  currentUser?: UserModel
  params?: P
}
