import { AddServiceUseCase } from '@/domain/usecases/service/AddServiceUseCase'
import { NewServiceModel } from '@/domain/models/service/NewServiceModel'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { InsertServiceRepository } from '@/data/protocols/db/service/InsertServiceRepository'

export class DbAddServiceUseCase implements AddServiceUseCase {
  constructor(
    private readonly inserServiceRepository: InsertServiceRepository
  ) { }

  async add(service: NewServiceModel): Promise<ServiceModel> {
    return this.inserServiceRepository.insert(service)
  }
}
