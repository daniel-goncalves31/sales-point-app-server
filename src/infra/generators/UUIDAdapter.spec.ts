import uuid from 'uuid'
import { UUIDAdapter } from './UUIDAdapter'

const fakeUUID = 'uuid_value'
jest.mock('uuid', () => ({
  v4: (): string => fakeUUID,
}))

interface SutType {
  sut: UUIDAdapter
}

const makeSut = (): SutType => {
  const sut = new UUIDAdapter()

  return {
    sut
  }
}

describe('UUIDAdapter', () => {
  test('should return an uuid string', async () => {
    const { sut } = makeSut()
    const v4Spy = jest.spyOn(uuid, 'v4')
    v4Spy.mockReturnValueOnce(fakeUUID)

    const res = sut.generate()

    expect(res).toEqual(fakeUUID)

  })
  test('should throw if uuid throws', async () => {
    const { sut } = makeSut()
    const v4Spy = jest.spyOn(uuid, 'v4')
    v4Spy.mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.generate).toThrow()

  })
})
