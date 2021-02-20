export class ServerError extends Error {
  constructor () {
    super('Houve um problema com o servidor. Tente novamente mais tarde.')
    this.name = 'ServerError'
  }
}
