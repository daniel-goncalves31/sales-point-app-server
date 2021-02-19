import { DeleteServiceModel } from '@/domain/models/service/DeleteServiceModel'

export interface DeleteServiceRepository {
  remove(deleteService: DeleteServiceModel): Promise<void>
}