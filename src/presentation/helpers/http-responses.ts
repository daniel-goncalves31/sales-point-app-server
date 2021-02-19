import { HttpResponse } from '../protocols/HttpResponse'
import { ServerError } from '../protocols/errors'

export const badRequest = (error: Error): HttpResponse<Error> => ({
  status: 400,
  body: error
})

export const serverError = (): HttpResponse<Error> => ({
  status: 500,
  body: new ServerError()
})

export const ok = (data: any): HttpResponse => ({
  status: 200,
  body: data
})

export const noContent = (): HttpResponse => ({
  status: 204,
  body: null
})

export const forbidden = (error: Error): HttpResponse<Error> => ({
  status: 403,
  body: error
})

export const badGateway = (error: Error): HttpResponse<Error> => ({
  status: 502,
  body: error
})
