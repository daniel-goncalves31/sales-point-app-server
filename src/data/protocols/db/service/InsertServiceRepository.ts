import { NewServiceModel } from '@/domain/models/service/NewServiceModel'
import { ServiceModel } from '@/domain/models/service/ServiceModel'

export interface InsertServiceRepository {
  insert(newService: NewServiceModel): Promise<ServiceModel>
}