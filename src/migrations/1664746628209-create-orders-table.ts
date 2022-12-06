import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable1664746628209 implements MigrationInterface {
  name = 'createOrdersTable1664746628209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payment_method_enum" AS ENUM('FOR_CACHE', 
              'FOR_PAYPAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" 
                (
                   "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                   "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                   "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                   "user_id" uuid NOT NULL, 
                   "payment_id" character varying, 
                   "summary" integer, 
                   "status" character varying, 
                   "receiver_full_name" character varying, 
                   "receiver_phone_number" character varying, 
                   "extra_information" character varying, 
                   "address_id" uuid, 
                   "payment_method" "public"."payment_method_enum" NOT NULL DEFAULT 'FOR_CACHE',
                   CONSTRAINT "REL_d39c53244703b8534307adcd07" UNIQUE ("address_id"), 
                   CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
               )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a922b820eeef29ac1c6800e826" 
                ON "orders" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" 
                ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") 
                REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" 
                ADD CONSTRAINT "FK_d39c53244703b8534307adcd073" FOREIGN KEY ("address_id")
                REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orderProduct" 
                ADD CONSTRAINT "FK_72ebf0e268863adecee48581900" FOREIGN KEY ("order_id") 
                REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orderProduct" 
                DROP CONSTRAINT "FK_72ebf0e268863adecee48581900"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" 
                DROP CONSTRAINT "FK_d39c53244703b8534307adcd073"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" 
                DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_a922b820eeef29ac1c6800e826"',
    );
    await queryRunner.query('DROP TABLE "orders"');
  }
}
