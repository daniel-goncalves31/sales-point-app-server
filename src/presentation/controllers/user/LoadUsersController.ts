import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { UserList } from '@/domain/models/user/UserList'
import { Controller } from '@/presentation/protocols/Controller'
import { LoadUsersUseCase } from '@/domain/usecases/user/LoadUsersUseCase'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { log } from '@/presentation/helpers/log-helper'
import { serverError, ok } from '@/presentation/helpers/http-responses'

export class LoadUsersController implements Controller {
  constructor (private readonly loadUsersUseCase: LoadUsersUseCase) {}
  async handle (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _httpRequest: HttpRequest
  ): Promise<HttpResponse<UserList[] | Error>> {
    try {
      const users = await this.loadUsersUseCase.load()
      return ok(users)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
