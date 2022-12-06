/* eslint-disable max-len */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderStatus1670080449989 implements MigrationInterface {
  name = 'updateOrderStatus1670080449989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "orders" DROP COLUMN "status"');
    await queryRunner.query(
      "CREATE TYPE \"public\".\"orders_status_enum\" AS ENUM('CANCELED', 'COMPLETED', 'IN_PROGRESS', 'ERROR', 'REFUNDED')",
    );
    await queryRunner.query(
      'ALTER TABLE "orders" ADD "status" "public"."orders_status_enum" NOT NULL DEFAULT \'IN_PROGRESS\'',
    );
    await queryRunner.query(
      'ALTER TYPE "public"."payment_method_enum" RENAME TO "payment_method_enum_old"',
    );
    await queryRunner.query(
      'CREATE TYPE "public"."orders_payment_method_enum" AS ENUM(\'FOR_CACHE\', \'FOR_PAYPAL\')',
    );
    await queryRunner.query(
      'ALTER TABLE "orders" ALTER COLUMN "payment_method" DROP DEFAULT',
    );
    await queryRunner.query(
      'ALTER TABLE "orders" ALTER COLUMN "payment_method" TYPE "public"."orders_payment_method_enum" USING "payment_method"::"text"::"public"."orders_payment_method_enum"',
    );
    await queryRunner.query(
      'ALTER TABLE "orders" ALTER COLUMN "payment_method" SET DEFAULT \'FOR_CACHE\'',
    );
    await queryRunner.query('DROP TYPE "public"."payment_method_enum_old"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TYPE "public"."payment_method_enum_old" AS ENUM(\'FOR_CACHE\', \'FOR_PAYPAL\')',
    );
    await queryRunner.query(
      'ALTER TABLE "orders" ALTER COLUMN "payment_method" DROP DEFAULT',
    );
    await queryRunner.query(
      'ALTER TABLE "orders" ALTER COLUMN "payment_method" TYPE "public"."payment_method_enum_old" USING "payment_method"::"text"::"public"."payment_method_enum_old"',
    );
    await queryRunner.query(
      'ALTER TABLE "orders" ALTER COLUMN "payment_method" SET DEFAULT \'FOR_CACHE\'',
    );
    await queryRunner.query('DROP TYPE "public"."orders_payment_method_enum"');
    await queryRunner.query(
      'ALTER TYPE "public"."payment_method_enum_old" RENAME TO "payment_method_enum"',
    );
    await queryRunner.query('ALTER TABLE "orders" DROP COLUMN "status"');
    await queryRunner.query('DROP TYPE "public"."orders_status_enum"');
    await queryRunner.query(
      'ALTER TABLE "orders" ADD "status" character varying',
    );
  }
}
