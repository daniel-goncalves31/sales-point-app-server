/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from '@/presentation/protocols/Controller'
import { LoadAllUsersUseCase } from '@/domain/usecases/user/LoadAllUsersUseCase'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { UserModel } from '@/domain/models/user/UserModel'
import { serverError, ok } from '@/presentation/helpers/http-responses'
import { log } from '@/presentation/helpers/log-helper'

export class LoadAllUsersController implements Controller {
  constructor(private readonly loadAllUsersUseCase: LoadAllUsersUseCase) { }

  async handle(
    _httpRequest: HttpRequest
  ): Promise<HttpResponse<UserModel[] | Error>> {
    try {
      const users = await this.loadAllUsersUseCase.load()
      return ok(users)
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
