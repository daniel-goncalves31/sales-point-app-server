import { ProductModel, ProductStatus } from '@/domain/models/product/ProductModel'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { closeSqliteConnection, setupSqliteConnection } from '../sqlite-helper'

import { DeleteProductModel } from '@/domain/models/product/DeleteProductModel'
import { NewProductModel } from '@/domain/models/product/NewProductModel'
import { ProductEntity } from '../entities/ProductEntity'
import { ProductTypeOrmRepository } from './ProductTypeOrmRepository'
import { UserEntity } from '../entities/UserEntity'
import { getRepository } from 'typeorm'

const fakeUserId = 'b3d7e8d8-9a9f-46fa-9748-92b5cfef7301'

const fakeUser: UserModel = {
  id: fakeUserId,
  name: 'any_name',
  username: 'any_username',
  password: 'hashed_password',
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE
}

interface SutType {
  sut: ProductTypeOrmRepository
}

const makeSut = (): SutType => {
  const sut = new ProductTypeOrmRepository()

  return {
    sut
  }
}

beforeAll(async () => {
  await setupSqliteConnection()
  await getRepository(UserEntity).save(fakeUser as any)
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('ProductTypeOrmRepository', () => {
  describe('insert()', () => {
    test('should add the product and return it with id', async () => {
      const { sut } = makeSut()

      const fakeNewProduct: NewProductModel = {
        product: {
          name: 'any_name',
          brand: 'any_brand',
          price: 1,
          quantity: 2,
          minQuantity: 1,
          status: ProductStatus.ACTIVE
        },
        purchasePrice: 2.99
      }

      const res = await sut.insert(fakeNewProduct, fakeUserId)
      expect(res.product.id).toBeTruthy()
      expect(res.purchase.id).toBeTruthy()
      expect(res.purchase.items.length).toBe(1)
    })
  })

  describe('update()', () => {
    test('should update the product with the given id', async () => {
      const { sut } = makeSut()

      const fakeProduct: ProductModel = {
        id: 1,
        name: 'any_name',
        brand: 'any_brand',
        price: 1,
        quantity: 2,
        minQuantity: 1,
        status: ProductStatus.ACTIVE
      }

      const repo = getRepository<ProductModel>(ProductEntity)
      const product = await repo.save(fakeProduct)

      product.name = 'another_name'
      product.price = 2.5

      const res = await sut.update(product)

      const updateProduct = await repo.findOne({ where: { id: product.id } })

      expect(res).toBeUndefined()
      expect(updateProduct?.name).toEqual(product.name)
      expect(updateProduct?.price).toEqual(product.price)
    })
  })
  describe('remove()', () => {
    test('should delete the product with the given id', async () => {
      const { sut } = makeSut()

      const fakeProduct: ProductModel = {
        id: 5,
        name: 'any_name',
        brand: 'any_brand',
        price: 1,
        quantity: 2,
        minQuantity: 1,
        status: ProductStatus.ACTIVE
      }

      const repo = getRepository<ProductModel>(ProductEntity)
      const product = await repo.save(fakeProduct)

      const fakeDeleteProductModel: DeleteProductModel = {
        id: product.id
      }

      const res = await sut.remove(fakeDeleteProductModel)
      const deletedProduct = await repo.findOne({ where: { id: product.id } })

      expect(res).toBeUndefined()
      expect(deletedProduct).toBeFalsy()
    })
  })
  describe('getAllProducts()', () => {
    test('should return all products', async () => {
      const { sut } = makeSut()


      const fakeProduct: NewProductModel = {
        product: {
          name: 'any_name',
          brand: 'any_brand',
          price: 1,
          quantity: 2,
          minQuantity: 1,
          status: ProductStatus.ACTIVE
        },
        purchasePrice: 2.99
      }


      const fakeArrProducts: NewProductModel[] = [
        fakeProduct,
        fakeProduct,
        fakeProduct
      ]

      const repo = getRepository<ProductModel>(ProductEntity)
      await repo.save(fakeArrProducts.map(item => ({ ...item.product })))

      const products = await sut.getAllProducts()

      expect(products).toHaveLength(4)
    })
  })
})
