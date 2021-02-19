import {MigrationInterface, QueryRunner} from 'typeorm'

export class CreateTables1613773825791 implements MigrationInterface {
    name = 'CreateTables1613773825791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "services" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "brand" varchar NOT NULL)')
        await queryRunner.query('CREATE TABLE "sale_items" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" decimal NOT NULL, "purchasePrice" decimal, "quantity" integer NOT NULL, "productId" integer, "serviceId" integer, "saleId" integer NOT NULL)')
        await queryRunner.query('CREATE TABLE "sales" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" datetime NOT NULL DEFAULT (datetime(\'now\')), "paymentType" varchar CHECK( paymentType IN (\'0\',\'10\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\') ) NOT NULL DEFAULT (0), "userId" varchar NOT NULL, "total" decimal NOT NULL)')
        await queryRunner.query('CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar CHECK( role IN (\'Admin Master\',\'Admin\',\'Employee\') ) NOT NULL DEFAULT (\'Employee\'), "status" varchar CHECK( status IN (\'Active\',\'Inactive\') ) NOT NULL DEFAULT (\'Active\'), "accessToken" varchar)')
        await queryRunner.query('CREATE TABLE "purchases" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" datetime NOT NULL DEFAULT (datetime(\'now\')), "userId" varchar NOT NULL)')
        await queryRunner.query('CREATE TABLE "purchase_items" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" decimal NOT NULL, "quantity" integer NOT NULL, "productId" integer NOT NULL, "purchaseId" integer NOT NULL)')
        await queryRunner.query('CREATE TABLE "products" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "brand" varchar NOT NULL, "price" decimal NOT NULL, "quantity" integer NOT NULL, "minQuantity" integer NOT NULL, "status" varchar CHECK( status IN (\'1\',\'2\') ) NOT NULL DEFAULT (1))')
        await queryRunner.query('CREATE TABLE "temporary_sale_items" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" decimal NOT NULL, "purchasePrice" decimal, "quantity" integer NOT NULL, "productId" integer, "serviceId" integer, "saleId" integer NOT NULL, CONSTRAINT "FK_d675aea38a16313e844662c48f8" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_67073c462461ef932634df985d5" FOREIGN KEY ("serviceId") REFERENCES "services" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c642be08de5235317d4cf3deb40" FOREIGN KEY ("saleId") REFERENCES "sales" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)')
        await queryRunner.query('INSERT INTO "temporary_sale_items"("id", "price", "purchasePrice", "quantity", "productId", "serviceId", "saleId") SELECT "id", "price", "purchasePrice", "quantity", "productId", "serviceId", "saleId" FROM "sale_items"')
        await queryRunner.query('DROP TABLE "sale_items"')
        await queryRunner.query('ALTER TABLE "temporary_sale_items" RENAME TO "sale_items"')
        await queryRunner.query('CREATE TABLE "temporary_sales" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" datetime NOT NULL DEFAULT (datetime(\'now\')), "paymentType" varchar CHECK( paymentType IN (\'0\',\'10\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\') ) NOT NULL DEFAULT (0), "userId" varchar NOT NULL, "total" decimal NOT NULL, CONSTRAINT "FK_52ff6cd9431cc7687c76f935938" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)')
        await queryRunner.query('INSERT INTO "temporary_sales"("id", "date", "paymentType", "userId", "total") SELECT "id", "date", "paymentType", "userId", "total" FROM "sales"')
        await queryRunner.query('DROP TABLE "sales"')
        await queryRunner.query('ALTER TABLE "temporary_sales" RENAME TO "sales"')
        await queryRunner.query('CREATE TABLE "temporary_purchases" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" datetime NOT NULL DEFAULT (datetime(\'now\')), "userId" varchar NOT NULL, CONSTRAINT "FK_341f0dbe584866284359f30f3da" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)')
        await queryRunner.query('INSERT INTO "temporary_purchases"("id", "date", "userId") SELECT "id", "date", "userId" FROM "purchases"')
        await queryRunner.query('DROP TABLE "purchases"')
        await queryRunner.query('ALTER TABLE "temporary_purchases" RENAME TO "purchases"')
        await queryRunner.query('CREATE TABLE "temporary_purchase_items" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" decimal NOT NULL, "quantity" integer NOT NULL, "productId" integer NOT NULL, "purchaseId" integer NOT NULL, CONSTRAINT "FK_5b31a541ce1fc1f428db518efa4" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_8bafbb5d45827a5d25f5cd3c6f3" FOREIGN KEY ("purchaseId") REFERENCES "purchases" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)')
        await queryRunner.query('INSERT INTO "temporary_purchase_items"("id", "price", "quantity", "productId", "purchaseId") SELECT "id", "price", "quantity", "productId", "purchaseId" FROM "purchase_items"')
        await queryRunner.query('DROP TABLE "purchase_items"')
        await queryRunner.query('ALTER TABLE "temporary_purchase_items" RENAME TO "purchase_items"')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "purchase_items" RENAME TO "temporary_purchase_items"')
        await queryRunner.query('CREATE TABLE "purchase_items" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" decimal NOT NULL, "quantity" integer NOT NULL, "productId" integer NOT NULL, "purchaseId" integer NOT NULL)')
        await queryRunner.query('INSERT INTO "purchase_items"("id", "price", "quantity", "productId", "purchaseId") SELECT "id", "price", "quantity", "productId", "purchaseId" FROM "temporary_purchase_items"')
        await queryRunner.query('DROP TABLE "temporary_purchase_items"')
        await queryRunner.query('ALTER TABLE "purchases" RENAME TO "temporary_purchases"')
        await queryRunner.query('CREATE TABLE "purchases" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" datetime NOT NULL DEFAULT (datetime(\'now\')), "userId" varchar NOT NULL)')
        await queryRunner.query('INSERT INTO "purchases"("id", "date", "userId") SELECT "id", "date", "userId" FROM "temporary_purchases"')
        await queryRunner.query('DROP TABLE "temporary_purchases"')
        await queryRunner.query('ALTER TABLE "sales" RENAME TO "temporary_sales"')
        await queryRunner.query('CREATE TABLE "sales" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "date" datetime NOT NULL DEFAULT (datetime(\'now\')), "paymentType" varchar CHECK( paymentType IN (\'0\',\'10\',\'1\',\'2\',\'3\',\'4\',\'5\',\'6\') ) NOT NULL DEFAULT (0), "userId" varchar NOT NULL, "total" decimal NOT NULL)')
        await queryRunner.query('INSERT INTO "sales"("id", "date", "paymentType", "userId", "total") SELECT "id", "date", "paymentType", "userId", "total" FROM "temporary_sales"')
        await queryRunner.query('DROP TABLE "temporary_sales"')
        await queryRunner.query('ALTER TABLE "sale_items" RENAME TO "temporary_sale_items"')
        await queryRunner.query('CREATE TABLE "sale_items" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" decimal NOT NULL, "purchasePrice" decimal, "quantity" integer NOT NULL, "productId" integer, "serviceId" integer, "saleId" integer NOT NULL)')
        await queryRunner.query('INSERT INTO "sale_items"("id", "price", "purchasePrice", "quantity", "productId", "serviceId", "saleId") SELECT "id", "price", "purchasePrice", "quantity", "productId", "serviceId", "saleId" FROM "temporary_sale_items"')
        await queryRunner.query('DROP TABLE "temporary_sale_items"')
        await queryRunner.query('DROP TABLE "products"')
        await queryRunner.query('DROP TABLE "purchase_items"')
        await queryRunner.query('DROP TABLE "purchases"')
        await queryRunner.query('DROP TABLE "users"')
        await queryRunner.query('DROP TABLE "sales"')
        await queryRunner.query('DROP TABLE "sale_items"')
        await queryRunner.query('DROP TABLE "services"')
    }

}
