import { DeleteServiceModel } from '@/domain/models/service/DeleteServiceModel'

export interface DeleteServiceUseCase {
  delete(service: DeleteServiceModel): Promise<void>
}