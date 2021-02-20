import { UUIDGenerator } from '@/data/protocols/generators/UUIDGenerator'
import { v4 } from 'uuid'

export class UUIDAdapter implements UUIDGenerator {
  generate(): string {
    return v4()
  }
}