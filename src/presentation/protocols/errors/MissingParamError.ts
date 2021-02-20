export class MissingParamError extends Error {
  constructor (readonly paramName: string) {
    super(`${paramName} não informado.`)
    this.name = 'MissingParamError'
  }
}
