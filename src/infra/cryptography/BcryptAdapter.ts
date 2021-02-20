import { Encrypter } from '@/data/protocols/cryptography/Encrypter'
import { HashComparer } from '@/data/protocols/cryptography/HashComparer'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashComparer, Encrypter {
  constructor(private readonly salt: number) { }
  async compare(value: string, hashedValue: string): Promise<boolean> {
    return await bcrypt.compare(value, hashedValue)
  }

  encrypt(value: string): string {
    return bcrypt.hashSync(value, this.salt)
  }
}
