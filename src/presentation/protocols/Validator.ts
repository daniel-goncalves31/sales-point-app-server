export interface Validator<T = any> {
  validate(value: T): Error | null
}
