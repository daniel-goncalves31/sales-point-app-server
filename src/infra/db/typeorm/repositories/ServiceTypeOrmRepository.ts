import { DeleteServiceRepository } from '@/data/protocols/db/service/DeleteServiceRepository'
import { InsertServiceRepository } from '@/data/protocols/db/service/InsertServiceRepository'
import { LoadServicesRepository } from '@/data/protocols/db/service/LoadServicesRepository'
import { UpdateServiceRepository } from '@/data/protocols/db/service/UpdateServiceRepository'
import { DeleteServiceModel } from '@/domain/models/service/DeleteServiceModel'
import { NewServiceModel } from '@/domain/models/service/NewServiceModel'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { getRepository } from 'typeorm'
import { ServiceEntity } from '../entities/ServiceEntity'

export class ServiceTypeOrmRepository implements InsertServiceRepository, LoadServicesRepository, UpdateServiceRepository, DeleteServiceRepository {

  async insert(newService: NewServiceModel): Promise<ServiceModel> {
    return await getRepository(ServiceEntity).save(newService)
  }

  async getAllServices(): Promise<ServiceModel[]> {
    const repository = getRepository<ServiceModel>(ServiceEntity)
    return await repository.find()
  }

  async update(service: ServiceModel): Promise<void> {
    const repository = getRepository<ServiceModel>(ServiceEntity)
    await repository.save(service)
  }

  async remove(deleteService: DeleteServiceModel): Promise<void> {
    const repository = getRepository<ServiceModel>(ServiceEntity)
    await repository.delete(deleteService)
  }
}