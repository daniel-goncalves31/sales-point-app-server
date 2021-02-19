import { Encrypter } from '@/data/protocols/cryptography/Encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '@/data/protocols/cryptography/Decrypter'

export class JsonwebtokenAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  encrypt (value: string): string {
    return jwt.sign({ id: value }, this.secret)
  }

  async decrypt (token: string): Promise<string> {
    return jwt.verify(token, this.secret) as string
  }
}
