import { UpdateServiceUseCase } from '@/domain/usecases/service/UpdateServiceUseCase'
import { ServiceModel } from '@/domain/models/service/ServiceModel'
import { UpdateServiceRepository } from '@/data/protocols/db/service/UpdateServiceRepository'

export class DbUpdateServiceUseCase implements UpdateServiceUseCase {
  constructor(
    private readonly updateServiceRepository: UpdateServiceRepository
  ) { }

  async update(service: ServiceModel): Promise<void> {
    await this.updateServiceRepository.update(service)
  }
}
