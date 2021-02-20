import { LoadServicesUseCase } from '@/domain/usecases/service/LoadServicesUseCase'
import { LoadServicesRepository } from '@/data/protocols/db/service/LoadServicesRepository'
import { ServiceModel } from '@/domain/models/service/ServiceModel'

export class DbLoadServicesUseCase implements LoadServicesUseCase {
  constructor(
    private readonly loadServicesRepository: LoadServicesRepository
  ) { }

  async load(): Promise<ServiceModel[]> {
    return await this.loadServicesRepository.getAllServices()
  }
}
