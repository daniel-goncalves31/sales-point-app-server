import { ServiceModel } from '@/domain/models/service/ServiceModel'

export interface LoadServicesUseCase {
  load(): Promise<ServiceModel[]>
}