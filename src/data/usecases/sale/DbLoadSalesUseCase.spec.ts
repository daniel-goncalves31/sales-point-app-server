import { DbLoadSalesUseCase } from './DbLoadSalesUseCase'
import { MockProxy, mock } from 'jest-mock-extended'
import { LoadSalesRepository } from '@/data/protocols/db/sale/LoadSalesRepository'
import { LoadSaleParamsModel } from '@/domain/models/sale/LoadSaleParamsModel'
import { SaleModel, SalePaymentType } from '@/domain/models/sale/SaleModel'

const fakeSaleParams: LoadSaleParamsModel = {
  date: 'any_date',
  filter: 'any_value'
}

const fakeSalesModel: SaleModel[] = [
  {
    id: 1,
    userId: 'user_id',
    total: 299,
    paymentType: SalePaymentType.MONEY,
    items: [
      {
        id: 1,
        price: 2.88,
        product: {} as any,
        quantity: 1,
        saleId: 1,
        purchasePrice: 2
      }
    ],
    date: new Date()
  }
]

interface SutType {
  sut: DbLoadSalesUseCase
  loadSalesRepositoryStub: MockProxy<LoadSalesRepository>
}

const makeSut = (): SutType => {
  const loadSalesRepositoryStub = mock<LoadSalesRepository>()
  loadSalesRepositoryStub.getSales.mockReturnValue(
    Promise.resolve(fakeSalesModel)
  )

  const sut = new DbLoadSalesUseCase(loadSalesRepositoryStub)

  return {
    sut,
    loadSalesRepositoryStub
  }
}

describe('DbLoadSalesUseCase', () => {
  test('should call LoadSalesRepository with correct values', async () => {
    const { sut, loadSalesRepositoryStub } = makeSut()

    await sut.load(fakeSaleParams)

    expect(loadSalesRepositoryStub.getSales).toHaveBeenCalledWith(
      fakeSaleParams
    )
    expect(loadSalesRepositoryStub.getSales).toHaveBeenCalledTimes(1)
  })

  test('should throw if LoadSalesRepository throws', async () => {
    const { sut, loadSalesRepositoryStub } = makeSut()
    loadSalesRepositoryStub.getSales.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.load(fakeSaleParams)

    await expect(promise).rejects.toThrow()
  })

  test('should return an array of SaleModel on success', async () => {
    const { sut } = makeSut()

    const sales = await sut.load(fakeSaleParams)

    expect(sales).toEqual(fakeSalesModel)
  })
})
