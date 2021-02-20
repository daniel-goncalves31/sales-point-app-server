export class InvalidParamError extends Error {
  constructor (readonly paramName: string) {
    super(`${paramName} inválido.`)
    this.name = 'InvalidParamError'
  }
}
