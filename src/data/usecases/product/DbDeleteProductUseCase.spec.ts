import { DbDeleteProductUseCase } from './DbDeleteProductUseCase'
import { DeleteProductModel } from '@/domain/models/product/DeleteProductModel'
import { MockProxy, mock } from 'jest-mock-extended'
import { DeleteProductRepository } from '@/data/protocols/db/product/DeleteProductRepository'

const fakeDeleteModel: DeleteProductModel = {
  id: 1
}

interface SutType {
  sut: DbDeleteProductUseCase
  deleteProductRepositoryStub: MockProxy<DeleteProductRepository>
}

const makeSut = (): SutType => {
  const deleteProductRepositoryStub = mock<DeleteProductRepository>()

  const sut = new DbDeleteProductUseCase(deleteProductRepositoryStub)

  return {
    sut,
    deleteProductRepositoryStub
  }
}

describe('DbDeleteProductUseCase', () => {
  test('should call DeleteProductRepository with correct value', async () => {
    const { sut, deleteProductRepositoryStub } = makeSut()

    await sut.delete(fakeDeleteModel)

    expect(deleteProductRepositoryStub.remove).toHaveBeenCalledWith(
      fakeDeleteModel
    )
    expect(deleteProductRepositoryStub.remove).toHaveBeenCalledTimes(1)
  })
  test('should throw if DeleteProductRepository throws', async () => {
    const { sut, deleteProductRepositoryStub } = makeSut()
    deleteProductRepositoryStub.remove.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.delete(fakeDeleteModel)

    await expect(promise).rejects.toThrow()
  })
})
