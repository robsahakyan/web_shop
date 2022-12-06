import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderProductTable1664746509449
  implements MigrationInterface
{
  name = 'createOrderProductTable1664746509449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "orderProduct" 
                (
                    "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                    "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                    "product_id" uuid NOT NULL, 
                    "product_name" character varying NOT NULL, 
                    "product_price" integer NOT NULL, 
                    "quantity" integer NOT NULL, 
                    "order_id" uuid, 
                    CONSTRAINT "PK_8c89300e91ad0ff68f67e7037a9" PRIMARY KEY ("id")
                )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0d8e694108086cc52602a14f1" 
                ON "orderProduct" ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "orderProduct" 
                ADD CONSTRAINT "FK_f0d8e694108086cc52602a14f1a" FOREIGN KEY ("product_id") 
                REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orderProduct" 
                DROP CONSTRAINT "FK_f0d8e694108086cc52602a14f1a"`,
    );
    await queryRunner.query(
      'DROP INDEX "public"."IDX_f0d8e694108086cc52602a14f1"',
    );
    await queryRunner.query('DROP TABLE "orderProduct"');
  }
}
