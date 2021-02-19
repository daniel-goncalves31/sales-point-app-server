import { DeleteServiceModel } from '@/domain/models/service/DeleteServiceModel'
import { NewServiceModel } from '@/domain/models/service/NewServiceModel'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { getRepository } from 'typeorm'
import { ServiceEntity } from '../entities/ServiceEntity'
import { setupSqliteConnection, closeSqliteConnection } from '../sqlite-helper'
import { ServiceTypeOrmRepository } from './ServiceTypeOrmRepository'

interface SutType {
  sut: ServiceTypeOrmRepository
}

beforeAll(async () => {
  await setupSqliteConnection()
})

afterAll(async () => {
  await closeSqliteConnection()
})
const makeSut = (): SutType => {
  const sut = new ServiceTypeOrmRepository()

  return {
    sut
  }
}

describe('ServiceTypeOrmRepository', () => {
  describe('insert()', () => {
    test('should insert the service', async () => {
      const { sut } = makeSut()

      const fakeServiceModel: NewServiceModel = {
        name: 'any_name',
        brand: 'any_brand',
      }

      const res = await sut.insert(fakeServiceModel)
      expect(res.id).toBeTruthy()
      expect(res.name).toEqual(fakeServiceModel.name)
      expect(res.brand).toEqual(fakeServiceModel.brand)

    })
  })

  describe('getAllServices()', () => {
    test('should return all services', async () => {
      const { sut } = makeSut()

      const fakeService: NewServiceModel = {
        name: 'any_name',
        brand: 'any_brand',

      }

      const fakeArrServices: NewServiceModel[] = [
        fakeService,
        fakeService,
        fakeService
      ]

      const repo = getRepository<ServiceModel>(ServiceEntity)
      await repo.save(fakeArrServices)

      const services = await sut.getAllServices()

      expect(services).toHaveLength(4)
    })
  })

  describe('update()', () => {
    test('should update the service with the given id', async () => {
      const { sut } = makeSut()

      const fakeService: ServiceModel = {
        id: 1,
        name: 'any_name',
        brand: 'any_brand',
      }

      const repo = getRepository<ServiceModel>(ServiceEntity)
      const service = await repo.save(fakeService)

      service.name = 'another_name'
      service.brand = 'another_brand'

      const res = await sut.update(service)

      const updateService = await repo.findOne({ where: { id: service.id } })

      expect(res).toBeUndefined()
      expect(updateService?.name).toEqual(service.name)
      expect(updateService?.brand).toEqual(service.brand)
    })
  })

  describe('remove()', () => {
    test('should delete the service with the given id', async () => {
      const { sut } = makeSut()

      const fakeService: ServiceModel = {
        id: 5,
        name: 'any_name',
        brand: 'any_brand',
      }

      const repo = getRepository<ServiceModel>(ServiceEntity)
      const service = await repo.save(fakeService)

      const fakeDeleteServiceModel: DeleteServiceModel = {
        id: service.id
      }

      const res = await sut.remove(fakeDeleteServiceModel)
      const deletedService = await repo.findOne({ where: { id: service.id } })

      expect(res).toBeUndefined()
      expect(deletedService).toBeFalsy()
    })
  })
})
