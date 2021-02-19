import { HttpRequest } from './HttpRequest'
import { HttpResponse } from './HttpResponse'
import { AuthenticationModel } from '@/domain/models/user/AuthenticationModel'

export interface Middleware {
  handle(
    httpRequest: HttpRequest
  ): Promise<HttpResponse<AuthenticationModel | Error>>
}
