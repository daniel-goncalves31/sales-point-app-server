import { DeleteServiceUseCase } from '@/domain/usecases/service/DeleteServiceUseCase'
import { DeleteServiceModel } from '@/domain/models/service/DeleteServiceModel'
import { DeleteServiceRepository } from '@/data/protocols/db/service/DeleteServiceRepository'

export class DbDeleteServiceUseCase implements DeleteServiceUseCase {
  constructor(
    private readonly deleteServiceRepository: DeleteServiceRepository
  ) { }
  async delete(deleteServiceModel: DeleteServiceModel): Promise<void> {
    await this.deleteServiceRepository.remove(deleteServiceModel)
  }
}
