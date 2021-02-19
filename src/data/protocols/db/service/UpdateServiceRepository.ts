import { ServiceModel } from '@/domain/models/service/ServiceModel'

export interface UpdateServiceRepository {
  update(service: ServiceModel): Promise<void>
}