export class InvalidCodeError extends Error {
  constructor(readonly code: string) {
    super(`'${code}' inválido.`)
    this.name = 'InvalidCodeError'
  }
}
