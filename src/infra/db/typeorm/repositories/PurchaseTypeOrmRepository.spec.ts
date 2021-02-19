import { PurchaseTypeOrmRepository } from './PurchaseTypeOrmRepository'
import { setupSqliteConnection, closeSqliteConnection } from '../sqlite-helper'
import { NewPurchaseModel } from '@/domain/models/purchase/NewPurchaseModel'
import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { getRepository } from 'typeorm'
import { UserEntity } from '../entities/UserEntity'
import { ProductEntity } from '../entities/ProductEntity'
import { PurchaseEntity } from '../entities/PurchaseEntity'
import { PurchaseItemEntity } from '../entities/PurchaseItemEntity'
import { LoadPurchaseParamsModel } from '@/domain/models/purchase/LoadPurchaseParamsModel'
import { UpdatePurchaseItemModel } from '@/domain/models/purchase/UpdatePurchaseItemModel'

const fakeUserId = 'b3d7e8d8-9a9f-46fa-9748-92b5cfef7301'

const fakeUser: UserModel = {
  id: fakeUserId,
  name: 'any_name',
  username: 'any_username',
  password: 'hashed_password',
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE
}

const fakeNewProduct = {
  name: 'any_name',
  brand: 'any_brand',
  price: 1,
  quantity: 5,
  minQuantity: 1
}

const fakeNewPurchase: NewPurchaseModel = {
  items: [
    {
      price: 4.99,
      productId: 1,
      quantity: 3
    },
    {
      price: 2.99,
      productId: 1,
      quantity: 1
    }
  ]
}

const fakePurchaseParams: LoadPurchaseParamsModel = {
  date: '2020-01-01 - 2020-08-01',
  filter: 'any'
}

interface SutType {
  sut: PurchaseTypeOrmRepository
}

const makeSut = (): SutType => {
  const sut = new PurchaseTypeOrmRepository()

  return {
    sut
  }
}

beforeAll(async () => {
  await setupSqliteConnection()
})

afterAll(async () => {
  await closeSqliteConnection()
})

describe('PurchaseTypeOrmRepository', () => {
  test('should insert the purchase', async () => {
    const { sut } = makeSut()

    await getRepository(UserEntity).save(fakeUser as any)
    const olderProduct = await getRepository(ProductEntity).save(fakeNewProduct)
    const purchase = await sut.insert(fakeNewPurchase, fakeUserId)

    const product = await getRepository(ProductEntity).findOne({
      id: olderProduct.id
    })
    expect(purchase.id).toBeTruthy()
    expect(purchase.items.length).toBe(2)
    expect(product?.quantity).toBe(9)
  })

  test('should return the correct purchases', async () => {
    const { sut } = makeSut()

    await getRepository(UserEntity).save(fakeUser as any)
    await getRepository(ProductEntity).save(fakeNewProduct)

    const purchase1 = await getRepository(PurchaseEntity).save({
      date: new Date(),
      userId: fakeUserId
    })
    await getRepository(PurchaseItemEntity).save(
      fakeNewPurchase.items.map(item => ({ ...item, purchaseId: purchase1.id }))
    )

    const purchase2 = await getRepository(PurchaseEntity).save({
      date: new Date('2020-07-27'),
      userId: fakeUserId
    })
    await getRepository(PurchaseItemEntity).save(
      fakeNewPurchase.items.map(item => ({ ...item, purchaseId: purchase2.id }))
    )

    const purchases = await sut.getPurchases(fakePurchaseParams)

    expect(purchases.length).toBe(1)
  })

  test('should remove the purchase', async () => {
    const { sut } = makeSut()

    const user = await getRepository(UserEntity).save(fakeUser as any)
    const product = await getRepository(ProductEntity).save(fakeNewProduct)
    const purchase = await getRepository(PurchaseEntity).save({
      userId: user.id,
      date: new Date()
    })
    const item = await getRepository(PurchaseItemEntity).save({
      price: 2,
      quantity: 2,
      productId: product.id,
      purchaseId: purchase.id
    })

    await sut.remove(purchase.id)

    const deletedPurchase = await getRepository(PurchaseEntity).findOne({
      where: { id: purchase.id }
    })
    const deletedItem = await getRepository(PurchaseItemEntity).findOne({
      where: { id: item.id }
    })

    expect(deletedPurchase).toBeFalsy()
    expect(deletedItem).toBeFalsy()
  })
  test('should update the item', async () => {

    const { sut } = makeSut()

    const purchase = await getRepository(PurchaseEntity).save({ date: new Date().toISOString(), userId: fakeUserId })

    const oldProduct = await getRepository(ProductEntity).save({ name: 'any_product', brand: 'any_name', quantity: 5, minQuantity: 4, price: 2 })
    const newProduct = await getRepository(ProductEntity).save({ name: 'any_product', brand: 'any_name', quantity: 5, minQuantity: 4, price: 2 })
    const purchaseItem = await getRepository(PurchaseItemEntity).save({ price: 2, quantity: 4, productId: oldProduct.id, purchaseId: purchase.id })

    const fakeUpdateItem: UpdatePurchaseItemModel = {
      id: purchaseItem.id,
      price: 2.99,
      quantity: 2,
      productId: newProduct.id
    }

    await sut.updateItem(fakeUpdateItem)

    const oldProduct2 = await getRepository(ProductEntity).findOne({ where: { id: oldProduct.id } })
    const newProduct2 = await getRepository(ProductEntity).findOne({ where: { id: newProduct.id } })
    const purchaseItem2 = await getRepository(PurchaseItemEntity).findOne({ where: { id: purchaseItem.id } })

    expect(newProduct2!.quantity).toEqual(7)
    expect(oldProduct2!.quantity).toEqual(1)
    expect(purchaseItem2!.quantity).toEqual(2)
    expect(purchaseItem2!.price).toEqual(2.99)
  })

})
