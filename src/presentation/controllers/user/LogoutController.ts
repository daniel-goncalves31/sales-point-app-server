import { Controller } from '@/presentation/protocols/Controller'
import { HttpRequest } from '@/presentation/protocols/HttpRequest'
import { HttpResponse } from '@/presentation/protocols/HttpResponse'
import { LogoutUseCase } from '@/domain/usecases/user/LogoutUseCase'
import { serverError, noContent } from '@/presentation/helpers/http-responses'
import { log } from '@/presentation/helpers/log-helper'

export class LogoutController implements Controller {
  constructor (private readonly logoutUseCase: LogoutUseCase) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      await this.logoutUseCase.logOut(httpRequest.currentUser?.id!)

      return noContent()
    } catch (error) {
      log(error)
      return serverError()
    }
  }
}
