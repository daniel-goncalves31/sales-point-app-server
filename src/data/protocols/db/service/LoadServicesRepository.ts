import { ServiceModel } from '@/domain/models/service/ServiceModel'

export interface LoadServicesRepository {
  getAllServices(): Promise<ServiceModel[]>
}