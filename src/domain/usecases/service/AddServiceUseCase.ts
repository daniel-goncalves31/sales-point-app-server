import { NewServiceModel } from '@/domain/models/service/NewServiceModel'
import { ServiceModel } from '@/domain/models/service/ServiceModel'

export interface AddServiceUseCase {
  add(service: NewServiceModel): Promise<ServiceModel>
}
