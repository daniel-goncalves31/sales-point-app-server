import { ServiceModel } from '@/domain/models/service/ServiceModel'

export interface UpdateServiceUseCase {
  update(service: ServiceModel): Promise<void>
}