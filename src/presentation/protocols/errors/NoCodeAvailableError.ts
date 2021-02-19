export class NoCodeAvailableError extends Error {
  constructor() {
    super('There was no code available')
    this.name = 'NoCodeAvailableError'
  }
}
