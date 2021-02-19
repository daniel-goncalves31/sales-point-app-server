import { UserModel, UserRole, UserStatus } from '@/domain/models/user/UserModel'
import { closeSqliteConnection, setupSqliteConnection } from '../sqlite-helper'

import { LoadSaleParamsModel } from '@/domain/models/sale/LoadSaleParamsModel'
import { NewSaleModel } from '@/domain/models/sale/NewSaleModel'
import { ProductEntity } from '../entities/ProductEntity'
import { PurchaseEntity } from '../entities/PurchaseEntity'
import { PurchaseItemEntity } from '../entities/PurchaseItemEntity'
import { SaleEntity } from '../entities/SaleEntity'
import { SaleItemEntity } from '../entities/SaleItemEntity'
import { SalePaymentType } from '@/domain/models/sale/SaleModel'
import { SaleTypeOrmRepository } from './SaleTypeOrmRepository'
import { UpdateSaleModel } from '@/domain/models/sale/UpdateSaleModel'
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

const fakeNewProduct = {
  name: 'any_name',
  brand: 'any_brand',
  price: 1,
  quantity: 5,
  minQuantity: 1
}

const fakeNewSale: NewSaleModel = {
  userId: 'b3d7e8d8-9a9f-46fa-9748-92b5cfef7301',
  total: 299,
  paymentType: SalePaymentType.MONEY,
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

const fakeSaleParams: LoadSaleParamsModel = {
  date: '2020-01-01 - 2020-08-01',
  filter: 'any'
}

interface SutType {
  sut: SaleTypeOrmRepository
}

const makeSut = (): SutType => {
  const sut = new SaleTypeOrmRepository()

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

describe('SaleTypeOrmRepository', () => {
  test('should insert the sale', async () => {
    const { sut } = makeSut()

    await getRepository(UserEntity).save(fakeUser as any)
    const olderProduct = await getRepository(ProductEntity).save(fakeNewProduct)

    const user = await getRepository(UserEntity).save(fakeUser as any)

    const purchase = await getRepository(PurchaseEntity).save({
      userId: user.id,
      date: new Date()
    })

    await getRepository(PurchaseItemEntity).save({
      price: 2.99,
      productId: 1,
      purchaseId: purchase.id,
      quantity: 4
    })

    const sale = await sut.insert(fakeNewSale)

    const product = await getRepository(ProductEntity).findOne({
      id: olderProduct.id
    })
    expect(sale.id).toBeTruthy()
    expect(sale.items.length).toBe(2)
    expect(product?.quantity).toBe(1)
  })

  test('should return the correct sales', async () => {
    const { sut } = makeSut()

    await getRepository(UserEntity).save(fakeUser as any)
    await getRepository(ProductEntity).save(fakeNewProduct)

    const sale1 = await getRepository(SaleEntity).save({
      date: new Date(),
      userId: fakeUserId,
      total: 299
    })
    await getRepository(SaleItemEntity).save(
      fakeNewSale.items.map((item) => ({
        ...item,
        saleId: sale1.id,
        purchasePrice: 2
      }))
    )

    const sale2 = await getRepository(SaleEntity).save({
      date: new Date('2020-07-27'),
      userId: fakeUserId,
      total: 299
    })
    await getRepository(SaleItemEntity).save(
      fakeNewSale.items.map((item) => ({
        ...item,
        saleId: sale2.id,
        purchasePrice: 2
      }))
    )

    let sales = await sut.getSales(fakeSaleParams)
    expect(sales.length).toBe(1)

    const today = new Date()
    today.setDate(today.getDate() - 3)

    const sale3 = await getRepository(SaleEntity).save({
      date: new Date(today.toISOString()),
      userId: fakeUserId,
      total: 299
    })
    await getRepository(SaleItemEntity).save(
      fakeNewSale.items.map((item) => ({
        ...item,
        saleId: sale3.id,
        purchasePrice: 2
      }))
    )

    sales = await sut.getSales({})
    expect(sales.length).toBe(4)
  })

  test('should remove the sale', async () => {
    const { sut } = makeSut()

    const user = await getRepository(UserEntity).save(fakeUser as any)
    const product = await getRepository(ProductEntity).save(fakeNewProduct)
    const product2 = await getRepository(ProductEntity).save({...fakeNewProduct, name: 'any_name_2', brand: 'any_brand_2', id: 2})

    const sale = await getRepository(SaleEntity).save({
      userId: user.id,
      date: new Date(),
      total: 299
    })
    const item = await getRepository(SaleItemEntity).save({
      price: 2,
      quantity: 2,
      productId: product.id,
      saleId: sale.id,
      purchasePrice: 2
    })
    const item2 = await getRepository(SaleItemEntity).save({
      price: 2,
      quantity: 3,
      productId: product2.id,
      saleId: sale.id,
      purchasePrice: 2
    })
    
    await sut.remove(sale.id)

    const deletedSale = await getRepository(SaleEntity).findOne({
      where: { id: sale.id }
    })
    const deletedItem1 = await getRepository(SaleItemEntity).findOne({
      where: { id: item.id }
    })
    const deletedItem2 = await getRepository(SaleItemEntity).findOne({
      where: { id: item2.id }
    })

    const updatedProduct = await getRepository(ProductEntity).findOne({where: {id: product.id}})
    const updatedProduct2 = await getRepository(ProductEntity).findOne({where: {id: product2.id}})


    expect(deletedSale).toBeFalsy()
    expect(deletedItem1).toBeFalsy()
    expect(deletedItem2).toBeFalsy()
    expect(updatedProduct?.quantity).toBe(product.quantity + 2)
    expect(updatedProduct2?.quantity).toBe(product.quantity + 3)
  })

  test('should update the sale', async () => {
    const { sut } = makeSut()

    const user = await getRepository(UserEntity).save(fakeUser as any)
    const otherUser = await getRepository(UserEntity).save({
      ...fakeUser,
      id: '16f3b412-a57a-48c6-87f9-4e08a706eec1'
    } as any)

    const sale = await getRepository(SaleEntity).save({
      userId: user.id,
      date: new Date(),
      total: 299
    })

    const fakeSale: UpdateSaleModel = {
      id: sale.id,
      userId: otherUser.id,
      date: new Date()
    }

    await sut.update(fakeSale)

    const updatedSale = await getRepository(SaleEntity).findOne({
      where: { id: sale.id }
    })

    expect(updatedSale?.id).toBe(sale.id)
    expect(updatedSale?.userId).toBe(otherUser.id)
    expect(updatedSale?.date).not.toBe(sale.date)
  })

  test('should remove the item', async () => {

    const { sut } = makeSut()

    await getRepository(UserEntity).save(fakeUser as any)
    const product = await getRepository(ProductEntity).save(fakeNewProduct)

    const sale = await getRepository(SaleEntity).save({
      date: new Date(),
      userId: fakeUserId,
      total: 299
    })

    const saleItem = await getRepository(SaleItemEntity).save({
      product,
      price: 3,
      purchasePrice: 2,
      sale,
      quantity: 2
    })

    await sut.removeItem(saleItem!.id)

  })

})
